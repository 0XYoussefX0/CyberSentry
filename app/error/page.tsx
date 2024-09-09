export default function Error({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const errorMessage =
    searchParams.errorMessage ?? "Something went wrong. Please try again.";
  return <div>{errorMessage}</div>;
}

// <div style="background-color:#efeef1;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
//   <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:580px;margin:30px auto;background-color:#ffffff">
//     <tbody>
//       <tr style="width:100%">
//         <td>
//           <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="display:flex;justify-content:center;aling-items:center;padding:30px">
//             <tbody>
//               <tr>
//                 <td><img src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/logo.png" style="display:block;outline:none;border:none;text-decoration:none" width="150" /></td>
//               </tr>
//             </tbody>
//           </table>
//           <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:100%;display:flex">
//             <tbody>
//               <tr>
//                 <td>
//                   <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
//                     <tbody style="width:100%">
//                       <tr style="width:100%">
//                         <td data-id="__react-email-column" style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
//                         <td data-id="__react-email-column" style="border-bottom:1px solid rgb(145,71,255);width:102px"></td>
//                         <td data-id="__react-email-column" style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//           <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:5px 20px 10px 20px">
//             <tbody>
//               <tr>
//                 <td>
//                   <p style="font-size:14px;line-height:1.5;margin:16px 0">Hi {{user}},</p>
//                   <p style="font-size:14px;line-height:1.5;margin:16px 0">We received a request to reset the password for your CyberSentry account. No worries—it&#x27;s easy to get back on track!</p>
//                   <p style="font-size:14px;line-height:1.5;margin:16px 0">To reset your password, simply click the button below:</p>
//                   <p style="font-size:14px;line-height:1.5;margin:16px 0"><a href="{{redirect}}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#7F56D9;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:calc(100% - 20px);padding:10px 10px 10px 10px" target="_blank"><span><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:15" hidden>&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">Reset Your Password</span><span><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8203;</i><![endif]--></span></a></p>
//                   <p style="font-size:14px;line-height:1.5;margin:16px 0">If you didn&#x27;t request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
//                   <p style="font-size:14px;line-height:1.5;margin:16px 0">If you need further assistance, feel free to contact our support team.</p>
//                   <p style="font-size:14px;line-height:1.5;margin:16px 0">Best,<br />CyberSentry Support Team</p>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </td>
//       </tr>
//     </tbody>
//   </table>
//   <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:580px;margin:0 auto">
//     <tbody>
//       <tr>
//         <td>
//           <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
//             <tbody style="width:100%">
//               <tr style="width:100%">
//                 <td align="right" data-id="__react-email-column" style="width:fit;padding-right:8px"><a href="https://www.facebook.com" style="color:#067df7;text-decoration:none" target="_blank"><img src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/Facebook_Logo_Primary.png" style="display:block;outline:none;border:none;text-decoration:none;width:20px;height:20px" /></a></td>
//                 <td data-id="__react-email-column" style="width:28px;padding-left:8px"><a href="https://www.instagram.com" style="color:#067df7;text-decoration:none" target="_blank"><img src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/Instagram_Glyph_Gradient.png" style="display:block;outline:none;border:none;text-decoration:none;width:20px;height:20px" /></a></td>
//                 <td align="left" data-id="__react-email-column" style="width:fit;padding-left:8px"><a href="https://x.com" style="color:#067df7;text-decoration:none" target="_blank"><img src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/logo-black.png?t=2024-08-25T11%3A16%3A27.242Z" style="display:block;outline:none;border:none;text-decoration:none;width:20px;height:20px" /></a></td>
//               </tr>
//             </tbody>
//           </table>
//           <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
//             <tbody style="width:100%">
//               <tr style="width:100%">
//                 <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center;color:#706a7b">© 2022 CyberSentry, All Rights Reserved <br />123 Boulevard Mohamed VI, 3rd Floor, Casablanca, 20000 - Morocco</p>
//               </tr>
//             </tbody>
//           </table>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>
