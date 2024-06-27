// Ressource for status - Status.ressource.ts
import { Status } from '@/types/models'

const statusRessource = async (status: any): Promise<Status> => {
    return {
        id: status.id,
        name: status.name,
    }
}

export default statusRessource
