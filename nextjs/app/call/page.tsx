"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import mediasoupClient from "mediasoup-client";
import {
  AppData,
  Consumer,
  Device,
  Producer,
  RtpCapabilities,
  Transport,
} from "mediasoup-client/lib/types";

import { checkCameraAvailability } from "@/lib/utils";
import useSocketStore from "@/lib/zustand/socketStore";

import cameraIcon from "@/assets/cameraIcon.svg";
import chatIcon from "@/assets/chatIcon.svg";
import flipCameraIcon from "@/assets/flipCameraIcon.svg";
import micIcon from "@/assets/micIcon_2.svg";
import quitIcon from "@/assets/quitIcon.svg";
import shareIcon from "@/assets/shareIcon.svg";
import soundIcon from "@/assets/soundIcon.svg";
import user from "@/assets/user.png";

export default function Page() {
  const [hasFrontCamera, setHasFrontCamera] = useState<boolean | undefined>(
    undefined,
  );
  const socket = useSocketStore((state) => state.socket);
  const [tryAgain, setTryAgain] = useState(false);

  // this data comes from the backend we pass it to the map and then we pass that to the client component
  const data = [
    [
      user_id,
      {
        avatar_image: "",
        name: "",
        stream: undefined,
      },
    ],
    [
      user_id,
      {
        avatar_image: "",
        name: "",
        stream: undefined,
      },
    ],
    [
      user_id,
      {
        avatar_image: "",
        name: "",
        stream: undefined,
      },
    ],
    [
      user_id,
      {
        avatar_image: "",
        name: "",
        stream: undefined,
      },
    ],
  ];

  const [callParticipants, setCallPariticipants] = useState(new Map(data));

  // handle socket reconnection

  useEffect(() => {
    (async () => {
      const result = await checkCameraAvailability();
      if (!result) return;

      const { hasFrontCamera } = result;
      setHasFrontCamera(true);

      if (socket) {
        socket.on("end_call", () => {
          setTryAgain(true);
        });

        socket.on("new-producer", ({ producerID }) => {
          signalNewConsumerTransport(producerID);
        });
      }
    })();

    return () => {
      if (socket) {
        socket.off("new-producer");
        socket.off("end-call");
      }
    };
  }, []);

  const roomIsMuted = true;
  const micIsOn = true;
  const cameraIsOn = true;

  const searchParams = useSearchParams();

  const roomID = searchParams.get("roomID");
  const video = searchParams.get("video");

  const myCameraVideoRef = useRef<HTMLVideoElement | null>(null);
  if (!roomID) return;

  let params = {
    // mediasoup params
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };

  // UNDERSTAND WHAT THIS APP DATA THING MEAN BY VISITING THE MEDIASOUP DOCS, AND UPDATE THE TYPES

  // THESE VARIABLES SHOULDN'T BE DEFINED THIS WAY BECAUSE WHEN THE COMPONENT OR THE PAGE RERENDERS ALL OF THE VARIABLES ARE GOING TO BE REDEFINED AND AS A RESULT THEY WILL LOSE THE VALUES THAT WERE ASSIGNED TO THEM, SO EITHER USE A USEREF OR PROBABLY YOU DON'T NEED THAT MANY VARIABLES
  let audioParams = {};
  let videoParams: any = { params };
  let rtpCapabilities: RtpCapabilities | undefined;
  let device: Device | undefined;
  let producerTransport: Transport<AppData>;
  let audioProducer: Producer<AppData>;
  let videoProducer;
  let consumingTransports: string[] = [];

  type ConsumerTransports = {
    consumerTransport: Transport<AppData>;
    serverConsumerTransportID: string;
    producerId: string;
    consumer: Consumer<AppData>;
  }[];

  let consumerTransports: ConsumerTransports = [];

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        ...(video
          ? {
              video: {
                width: {
                  min: 640,
                  max: 1920,
                },
                height: {
                  min: 400,
                  max: 1080,
                },
              },
            }
          : {}),
      });

      if (video && myCameraVideoRef.current) {
        myCameraVideoRef.current.srcObject = stream;

        audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
        videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

        joinRoom();
      }
    } catch (e) {
      alert("we need access to your media a si mhamed");
    }
  };

  let peersStreams;

  const connectRecvTransport = (
    consumerTransport: Transport<AppData>,
    remoteProducerID: string,
    serverConsumerTransportID: string,
    remoteProducerUserId: string,
  ) => {
    if (!device) return;

    if (socket) {
      socket.emit(
        "consume",
        {
          rtpCapabilities: device.rtpCapabilities,
          remoteProducerID,
          serverConsumerTransportID,
        },
        async (params) => {
          if (params.error) {
            console.log("Cannot Consume");
            return;
          }

          const { id, kind, rtpParameters } = params;
          const consumer = await consumerTransport.consume({
            id,
            producerId: remoteProducerID,
            kind,
            rtpParameters,
          });

          consumerTransports = [
            ...consumerTransports,
            {
              consumerTransport,
              serverConsumerTransportID: id,
              producerId: remoteProducerID,
              consumer,
            },
          ];

          const { track } = consumer;

          setCallPariticipants((prevCallParticipants) => {
            const callParticipantsCopy = new Map(prevCallParticipants);
            const userData = callParticipantsCopy.get(remoteProducerUserId);
            if (!userData.stream) {
              userData.stream = new MediaStream();
            }
            userData.stream.addTrack(track);
            callParticipants.set(remoteProducerUserId, userData);
            return callParticipants;
          });
        },
      );
    }
  };

  const signalNewConsumerTransport = (
    remoteProducerID: string,
    remoteProducerUserId: string,
  ) => {
    if (consumingTransports.includes(remoteProducerID)) return;

    consumingTransports.push(remoteProducerID);

    if (socket) {
      socket.emit("createWebRtcTransport", { consumer: true }, (params) => {
        if (!device) return;

        if (params.error) {
          console.log(params.error);
          return;
        }

        let consumerTransport;
        try {
          consumerTransport = device.createRecvTransport(params);
        } catch (error) {
          console.log(error);
          return;
        }

        consumerTransport.on(
          "connect",
          ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit(
                "transport-recv-connect",
                {
                  dtlsParameters,
                  serverConsumerTransportID: params.id,
                },
                callback,
              );
            } catch (error) {
              errback(error);
            }
          },
        );

        connectRecvTransport(
          consumerTransport,
          remoteProducerID,
          params.id,
          remoteProducerUserId,
        );
      });
    }
  };

  // change the console logs to a toast function in order to show the message to the user

  const getProducers = () => {
    if (socket) {
      socket.emit("getProducers", (producersData) => {
        producersData.forEach((producerData) => {
          const { producerID, remoteProducerUserId } = producerData;
          signalNewConsumerTransport(producerID, remoteProducerUserId);
        });
      });
    }
  };

  const connectSendTransport = async () => {
    audioProducer = await producerTransport.produce(audioParams);
    videoProducer = await producerTransport.produce(videoParams);

    // you have to close the audio track and the video track inside these callbacks probably

    audioProducer.on("trackended", () => {
      console.log("audio track ended");
    });

    audioProducer.on("transportclose", () => {
      console.log("audio transport ended");
    });

    videoProducer.on("trackended", () => {
      console.log("video track ended");
    });

    videoProducer.on("transportclose", () => {
      console.log("video transport ended");
    });
  };

  const createSendTransport = () => {
    if (!socket) return;

    socket.emit("createWebRtcTransport", { consumer: false }, (params) => {
      if (params.error) {
        console.log(params.error);
        return;
      }

      if (!device) return;

      producerTransport = device.createSendTransport(params);

      producerTransport.on(
        "connect",
        ({ dtlsParameters }, callback, errback) => {
          try {
            socket.emit(
              "transport-connect",
              {
                dtlsParameters,
              },
              callback,
            );
          } catch (error) {
            errback(error);
          }
        },
      );

      producerTransport.on(
        "produce",
        ({ kind, rtpParameters, appData }, callback, errback) => {
          try {
            socket.emit(
              "transport-produce",
              {
                kind,
                rtpParameters,
                appData,
              },
              ({ id, producerExist }) => {
                callback({ id });

                if (producerExist) getProducers();
              },
            );
          } catch (error) {
            errback(error);
          }
        },
      );

      connectSendTransport();
    });
  };

  const createDevice = async () => {
    if (!rtpCapabilities) return;

    try {
      device = new mediasoupClient.Device();

      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });

      createSendTransport();
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = () => {
    if (!socket) return;

    socket.emit(
      "joinCallRoom",
      { roomID },
      (data: { rtpCapabilities: RtpCapabilities }) => {
        rtpCapabilities = data.rtpCapabilities;

        createDevice();
      },
    );
  };

  const participantsContainer = useRef<HTMLDivElement>(null);

  // BIG FAT WARNING: YOU CAN'T access the socket in this page, in fact the user is going to be disconnected if he navigates to this page, because the connectotsocket component is in the app layout, fix this bug

  // show some try again ui, the ui is basically going to have only the user in the center and it will show a button to cancel the call which when clicked should redirect the user to the messages route with the conversation opened, and it also shows a try again button that when clicked calls the user again

  // turn on the do not allow any anys in the code feature in tsconfig and start removing them
  return (
    <div className="min-h-screen bg-black justify-between flex flex-col">
      <div className="flex justify-between items-center px-4 py-5">
        <img alt="logo" />
        <div className="flex gap-4">
          {hasFrontCamera && (
            <button
              aria-label="flip camera"
              className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
            >
              <img src={flipCameraIcon.src} alt="" />
            </button>
          )}
          <button
            aria-label={roomIsMuted ? "unmute the room" : "mute the room"}
            className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
          >
            <img src={soundIcon.src} alt="" />
          </button>
        </div>
      </div>
      <div
        ref={participantsContainer}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2  py-2"
      >
        {Array.from(callParticipants).map(([key, value]) => {
          const { avatar_image, name, stream } = value;
          let audioTrack;
          let videoTrack;
          if (stream) {
            audioTrack = stream.getAudioTracks()[0];
            videoTrack = stream.getVideoTracks()[0];
          }
          return (
            <>
              {stream ? (
                // loading state
                <></>
              ) : audioTrack && videoTrack ? (
                <div>
                  <video src={stream} />
                </div>
              ) : (
                <div>
                  <audio src={stream} />
                </div>
              )}
            </>
          );
        })}
      </div>
      {/* <div className="flex relative aspect-video bg-[#0B0E15] rounded-2xl items-center justify-center">
            <img
             src={avatar_image}
            alt=""
             className="w-[70px] aspect-square rounded-full"
            />
           <div className="text-white text-sm tracking-[0.25px] absolute bottom-2 left-2 bg-black bg-opacity-65 flex  py-1 px-2 rounded-lg">
             {name}
          </div>
          </div> */}
      <video ref={myCameraVideoRef} />
      <div className="flex gap-4 justify-center px-4 pt-4 pb-8">
        <button
          aria-label="Quit The Room"
          className="border border-solid rounded-lg border-[#C74E5B] bg-[#C74E5B] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={quitIcon.src} alt="" />
        </button>
        <button
          aria-label={micIsOn ? "Turn off the mic" : "Turn on the mic"}
          className={`border border-solid rounded-lg border-[#272A31] bg-[${micIsOn ? "#272A31" : "black"}] flex justify-center items-center w-10 h-10 disabled:opacity-70`}
        >
          <img src={micIcon.src} alt="" />
        </button>
        <button
          aria-label={cameraIsOn ? "Turn off the camera" : "turn on the camera"}
          className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={cameraIcon.src} alt="" />
        </button>
        <button
          aria-label="open chat drawer"
          className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={chatIcon.src} alt="" />
        </button>
        <button
          aria-label="share "
          className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={shareIcon.src} alt="" />
        </button>
      </div>
    </div>
  );
}
