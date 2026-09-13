'use client';
import {useState} from 'react';
import {CopilotKitProvider,CopilotChat,useFrontendTool} from '@copilotkit/react-core/v2';
import {z} from 'zod';
import {ArusGuideAgent} from '@/lib/guide-agent';
type Props={connect:()=>void;refresh:()=>Promise<string>;research:()=>Promise<string>;snapshot:string};
function Tools({connect,refresh,research,snapshot}:Props){const render=({result}:{result?:unknown})=><p className="notice">{typeof result==='string'?result:'Working…'}</p>;
 useFrontendTool({name:'connect_google_drive',description:'Open the Google authorization dialog. The user signs in directly with Google.',parameters:z.object({}),handler:async()=>{connect();return 'Connection opened. Click Authorize Google & read sheet to grant read-only access.';},render},[connect]);
 useFrontendTool({name:'refresh_google_sheet',description:'Refresh the configured ledger using current Google authorization.',parameters:z.object({}),handler:refresh,render},[refresh]);
 useFrontendTool({name:'show_financial_metrics',description:'Show deterministic financial metrics for the current dashboard.',parameters:z.object({}),handler:async()=>snapshot,render},[snapshot]);
 useFrontendTool({name:'research_articles',description:'Find Mr Money TV articles for the selected metric using a minimized public query.',parameters:z.object({}),handler:research,render},[research]);
 return <CopilotChat labels={{welcomeMessageText:'Try “connect Google Drive”, “refresh sheet”, “show metrics”, or “research articles”.',chatInputPlaceholder:'Choose a guided action…'}}/>;
}
export default function ArusCopilot(props:Props){const [agents]=useState(()=>({default:new ArusGuideAgent({agentId:'default'})}));return <section className="panel copilot-panel"><div className="panel-heading"><div><h3>Arus assistant</h3><p>CopilotKit · Guided actions · Google read-only access</p></div></div><p className="fine">This prototype runs a local action controller. Google passwords and access tokens stay outside the conversation.</p><CopilotKitProvider selfManagedAgents={agents} enableInspector={false}><Tools {...props}/></CopilotKitProvider></section>;}
