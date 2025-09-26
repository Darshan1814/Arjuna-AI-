export const vapiConfig = {
  publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
  assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
  isConfigured: function() {
    return !!(this.publicKey && this.assistantId && 
              this.publicKey !== 'your_vapi_public_key_here' && 
              this.assistantId !== 'your_vapi_assistant_id_here');
  }
};