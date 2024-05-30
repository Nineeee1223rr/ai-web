import Dexie, {type Table} from 'dexie';

export class Database extends Dexie {
    history!: Table<HistoryItem>
    tab!: Table<TabItem>

    constructor() {
        super('ai')
        this.version(5).stores({
            history: '++id, session, type, role, content, src',
            tab: '++id, label'
        })
        // this.version(5).upgrade()
    }

    getLatestTab() {
        return DB.tab.orderBy('id').last();
    }

    getTabs() {
        return DB.tab.limit(100).reverse().toArray()
    }

    async getHistory(session: number) {
        const arr = await DB.history.where('session').equals(session).limit(100).toArray()
        arr.forEach(i => {
            if (i.type === 'image' && i.src instanceof Blob) {
                URL.revokeObjectURL(i.content)
                i.content = URL.createObjectURL(i.src)
            }
        })
        return arr
    }

    addTab(label: string) {
        return DB.tab.add({label})
    }

    deleteTabAndHistory(id: number) {
        return DB.transaction('rw', DB.tab, DB.history, async () => {
            await DB.tab.delete(id)
            await DB.history.where('session').equals(id).delete()
        })
    }
}

export const DB = new Database();

export const initialSettings = {

    image_steps: 20,
    system_prompt: '',
}

export type Settings = typeof initialSettings

export const additionalTextGenModels: Model[] = [
    {
        id: 'lama-2-7b-chat-fp16',
        name: 'lama-2-7b-chat-fp16',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'mistral-7b-instruct-v0.1',
        name: 'mistral-7b-instruct-v0.1',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'deepseek-coder-6.7b-base-awg',
        name: 'deepseek-coder-6.7b-base-awg',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'deepseek-math-7b-base',
        name: 'deepseek-math-7b-base',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'discolm-german-7b-v1-awg',
        name: 'discolm-german-7b-v1-awg',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'falcon-7b-instruct',
        name: 'falcon-7b-instruct',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'gemma-2b-it-lora',
        name: 'gemma-2b-it-lora',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'hermes-2-pro',
        name: 'hermes-2-pro',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'lama-2-13b-chat-awg',
        name: 'lama-2-13b-chat-awg',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'lamaguard-7b-awg',
        name: 'lamaguard-7b-awg',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'mistral-7b-instruct-v0.2',
        name: 'mistral-7b-instruct-v0.2',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'neural-chat-7b-v3-1-awg',
        name: 'neural-chat-7b-v3-1-awg',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'phi-2',
        name: 'phi-2',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'qwen1.5-0.5b-chat',
        name: 'qwen1.5-0.5b-chat',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'qwen1.5-1.8b-chat',
        name: 'qwen1.5-1.8b-chat',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'qwen1.5-7b-chat',
        name: 'qwen1.5-7b-chat',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'sqlcoder-7b-2',
        name: 'sqlcoder-7b-2',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'starling-lm-7b-beta',
        name: 'starling-lm-7b-beta',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'una-cybertron-7b-v2-bf16',
        name: 'una-cybertron-7b-v2-bf16',
        provider: 'workers-ai',
        type: 'chat'
    },
    {
        id: 'zephyr-7b',
        name: 'zephyr-7b',
        provider: 'workers-ai',
        type: 'chat'
    }
];

export const imageGenModels: Model[] = [{
    id: '@cf/lykon/dreamshaper-8-lcm',
    name: 'dreamshaper-8-lcm',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}, {
    id: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    name: 'stable-diffusion-xl-base-1.0',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}, {
    id: '@cf/bytedance/stable-diffusion-xl-lightning',
    name: 'stable-diffusion-xl-lightning',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}]

export const models: Model[] = [...textGenModels, ...imageGenModels]
