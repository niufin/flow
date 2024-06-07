import { BaseCache } from '@langchain/core/caches'
import { ChatFireworks } from '@langchain/community/chat_models/fireworks'
import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { MODEL_TYPE, getModels } from '../../../src/modelLoader'

class ChatFireworks_ChatModels implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatFireworks'
        this.name = 'chatFireworks'
        this.version = 1.0
        this.type = 'ChatFireworks'
        this.icon = 'Fireworks.png'
        this.category = 'Chat Models'
        this.description = 'Wrapper around Fireworks Chat Endpoints'
        this.baseClasses = [this.type, ...getBaseClasses(ChatFireworks)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['fireworksApi']
        }
        this.inputs = [
            {
                label: 'Cache',
                name: 'cache',
                type: 'BaseCache',
                optional: true
            },
            {
                label: 'Model',
                name: 'model',
                type: 'string'
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                step: 0.1,
                default: 0.9,
                optional: true
            }
        ]
    }

    //@ts-ignore
    loadMethods = {
        async listModels(): Promise<INodeOptionsValue[]> {
            return await getModels(MODEL_TYPE.CHAT, 'chatFireworks')
        }
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const cache = nodeData.inputs?.cache as BaseCache
        const temperature = nodeData.inputs?.temperature as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const fireworksApiKey = getCredentialParam('fireworksApiKey', credentialData, nodeData)

        const obj: Partial<ChatFireworks> = {
            fireworksApiKey,
            temperature: temperature ? parseFloat(temperature) : undefined,
        }
        if (cache) obj.cache = cache

        const model = new ChatFireworks(obj)
        return model
    }
}

module.exports = { nodeClass: ChatFireworks_ChatModels }
