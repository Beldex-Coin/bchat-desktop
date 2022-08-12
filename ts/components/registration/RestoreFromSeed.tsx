// import React,{useState} from 'react';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
// import { BchatInput } from '../basic/BchatInput';

// // const [seed,setSeed] = useState('');

// const RecoveryPhraseInput = (props: {
//   recoveryPhrase: string;
//   onSeedChanged: (val: string) => any;
//   handlePressEnter: () => any;
//   stealAutoFocus?: boolean;
// }) => {
//   return (
//     // tslint:disable-next-line: use-simple-attributes
//     <BchatInput
//       label={window.i18n('recoveryPhrase')}
//       type="password"
//       value={props.recoveryPhrase}
//       autoFocus={props.stealAutoFocus || false}
//       placeholder={window.i18n('enterRecoveryPhrase')}
//       enableShowHide={true}
//       onValueChanged={props.onSeedChanged}
//       onEnterPressed={props.handlePressEnter}
//       inputDataTestId="recovery-phrase-input"
//     />
//   );
// };

// const seedValidation = (props:any) =>{
//   console.log("props:seedValidation",props)
//   // console.log("props:seedValidation:seed",seed)

// }

// export const RestoreSeedInput = (props:any) => (
//       <div className={"bchat-id-And-Address-container"}
//         style={{
//         width: "50%",
//         margin: '0 auto',
//         textAlign:"center"
//       }}  >
//       <h1 
//       className={"bchat-head"} 
//         style={{
//         color:"white"
//         }}>{window.i18n('recoveryPhrase')}</h1>
//          <div className="bchat-registration__content">
//          <div className='bchat-registration__entry-fields'>
//         <RecoveryPhraseInput
//           recoveryPhrase={props.recoveryPhrase as string}
//           handlePressEnter={props.handlePressEnter}
//           // onSeedChanged={props.onSeedChanged as any}
//           onSeedChanged={(seed: string) => {

//             console.log("seed:",seed)
//             props.setSeed(seed)
//             // setSeed(seed)
//           }}
//           stealAutoFocus={props.stealAutoFocus}
//         />
//         </div>
//         <div className='id-And-Address-Sub-container'
//        style={{
//         padding:"5px 20px",
//         backgroundColor:"#353543"
//         ,borderRadius: "12px"
//         ,margin: "10px 0 25px",
//         display: "flex",
//         width: "100%",
//         justifyContent: "center",
//         fontSize: "12px",
//         color: "#0BB70F",
//         alignItems: "center"
//         }}>
//         <div style={{
//           justifyContent: "center",
//           display: "flex",
//           alignItems: "center",
//           fontSize: "12px",
//           color: "#0BB70F"
//           }}>
//             <h5>clear</h5>
//         </div>
//       </div>
//         </div>
//       <BchatButton
//         onClick={props.nextScreen}
//         buttonType={BchatButtonType.Brand}
//         buttonColor={BchatButtonColor.Green}
//         text={window.i18n('continue')}
//         // disabled={!props.enableCompleteSignUp}
//       />
//       </div>
// );


// import React from 'react';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';

// const Icons=(props:any)=><div onClick={()=>props.iconfunc()} style={{background:`url(images/bchat/${props.icon}.svg) no-repeat`,
//  width: "30px",
//     height: "48px",
//     position: 'relative',
//     top: '93px',
//     left: '515px',
//     cursor:'pointer'
// }}></div>

    

// export const DisplaySeed = (props: any) => (
//     <div className={"bchat-id-And-Address-container ,display-seed"}  style={{ width: "500px", margin: '0 auto' }}  >
//         {/* <h1 className={"bchat-head"} style={{ textAlign: 'center', color: "white" }}></h1> */}
//         <div className='id-And-Address-Sub-container' style={{ margin: "20px 0 65px" }}>
//             <h6 style={{ textAlign: "center", color: "white", fontSize: '18px', margin: 0, padding: "7px 0 20px 0px",fontWeight:"bold" }}>Restore from  store</h6>
//         {props.copyButton ? <Icons icon={"copy"} iconfunc={props.iconfunc}/>:<Icons icon={"paste"} iconfunc={props.iconfunc} /> }
            
//             <div style={{
//                 backgroundColor: "#353543",
//                 width: "100%",
//                 minHeight: '60px',
//                 borderRadius: "13px",
//                 textAlign: "center",
//                 display: "flex",
//                 alignItems: "center",
//                 color: "#0BB70F"
//             }}>
//                 {/* <input type='text' placeholder='Enter your recovery seed to restore your account'  style={{width:"100%",height:"100%",outline:'none',border:"none",wordWrap: "break-word"}}  /> */}
//                 <textarea rows={4} cols={60} name="text" value={props.recoveryPhrase} placeholder="Enter your recovery seed to restore your account" onChange={(e)=>props.assignRecoveryPhase(e.target.value)} style={{outline:'none',border:"none",resize:"none",textAlign: "center",    paddingTop: "20px"}}></textarea>

//             </div>
//             {props.assignRecoveryPhase && <button style={{width: "100%",height: "40px",border: "none",borderRadius: "10px",color: 'red',margin: "20px 0 0",background: "#282833"}} onClick={()=>props.assignRecoveryPhase("")} >clear</button>}

//         </div>
        

//         <BchatButton
//             onClick={props.recoveryPhrase? props.onNext:null}
//             buttonType={BchatButtonType.Brand}
//             buttonColor={BchatButtonColor.Green}
//             // text={window.i18n('getStarted')}
//             text="Next"
//         // disabled={!enableCompleteSignUp}
//         />
//     </div>
// );