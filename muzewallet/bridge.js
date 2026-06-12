const SB_URL = 'https://sktpjacowqaedddtrhuz.supabase.co';
const SB_KEY = 'sb_publishable_ChdrHQEJV7pVpJMKt-ZaUw_6V0WRKAR';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

const MUZE_BRIDGE = {
    // Encrypts a string using a simple key (password + handle)
    // For high-fidelity demo purposes.
    encrypt: (text, key) => {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    },

    decrypt: (encoded, key) => {
        let text = atob(encoded);
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    },

    saveRecoveryShard: async (handle, seed, password) => {
        const encryptedSeed = MUZE_BRIDGE.encrypt(seed, password + handle);
        const { data, error } = await supabaseClient
            .from('muze_vaults')
            .upsert({ 
                handle: handle, 
                recovery_shard: encryptedSeed,
                updated_at: new Date()
            }, { onConflict: 'handle' });
        
        if (error) throw error;
        return data;
    },

    getRecoveryShard: async (handle) => {
        const { data, error } = await supabaseClient
            .from('muze_vaults')
            .select('recovery_shard')
            .eq('handle', handle)
            .single();
        
        if (error) return null;
        return data.recovery_shard;
    }
};
