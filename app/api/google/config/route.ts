export function GET(){return Response.json({clientId:process.env.GOOGLE_OAUTH_CLIENT_ID||''},{headers:{'Cache-Control':'no-store'}});}
