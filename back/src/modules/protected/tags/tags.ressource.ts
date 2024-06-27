// Ressource for tag - Tag.ressource.ts
import type { Tag } from '@/types/models'
import { orm } from '@/middleware'
import { HTTPException } from 'hono/http-exception'

const tagRessource = async (tag: any): Promise<Tag> => {
    return {
        id: tag.id,
        name: tag.name,
        color: tag.color,
    }
}

export default tagRessource
