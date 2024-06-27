# Bash script for creating a new service file
# Usage: bun make:crud:service <service-name>

# Check if the service name is provided
if [ -z "$1" ]; then
    echo "Service name is required"
    exit 1
fi

# Get the service name
SERVICE_NAME=$1

# Create service name variants
SERVICE_NAME_LOWER_CASE=$(echo $SERVICE_NAME | tr '[:upper:]' '[:lower:]')
SERVICE_NAME_FIRST_LETTER_CAPITALIZED=$(tr '[:lower:]' '[:upper:]' <<< ${SERVICE_NAME:0:1})${SERVICE_NAME:1}

# Check if the module directory exists, if not create it
if [ ! -d "src/modules/$SERVICE_NAME_LOWER_CASE" ]; then
    mkdir src/modules/$SERVICE_NAME_LOWER_CASE
fi

# Check if the service file exists
if [ -f "src/modules/$SERVICE_NAME_LOWER_CASE/$SERVICE_NAME_LOWER_CASE.service.ts" ]; then
    echo "Service file already exists"
    exit 1
fi

# Create the service file
FILE_PATH="src/modules/$SERVICE_NAME_LOWER_CASE/$SERVICE_NAME_LOWER_CASE.service.ts"
touch $FILE_PATH

# Print the service file content
echo "// Service for $SERVICE_NAME_LOWER_CASE - ${SERVICE_NAME_LOWER_CASE}.service.ts" >> $FILE_PATH
echo "import { prisma } from '@/middlewares';" >> $FILE_PATH
echo "import { HTTPException } from 'hono/http-exception';" >> $FILE_PATH
echo "import ${SERVICE_NAME_LOWER_CASE}Ressource from './${SERVICE_NAME_LOWER_CASE}.ressource';" >> $FILE_PATH
echo "import { getAll, count, get, create, update, destroy } from '@/types';" >> $FILE_PATH
echo "import { $SERVICE_NAME_FIRST_LETTER_CAPITALIZED } from '@/types/models';" >> $FILE_PATH
echo "import AbstractCRUDService from '@/components/abstracts/AbstractCRUDService';" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "class ${SERVICE_NAME_FIRST_LETTER_CAPITALIZED}Service extends AbstractCRUDService<${SERVICE_NAME_FIRST_LETTER_CAPITALIZED}> {" >> $FILE_PATH
echo "  private $SERVICE_NAME_LOWER_CASE = prisma.${SERVICE_NAME_LOWER_CASE};" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  public getAll = async ({" >> $FILE_PATH
echo "    filters," >> $FILE_PATH
echo "    limit," >> $FILE_PATH
echo "    offset," >> $FILE_PATH
echo "    orderBy," >> $FILE_PATH
echo "    order," >> $FILE_PATH
echo "    trash," >> $FILE_PATH
echo "  }: getAll) => {" >> $FILE_PATH
echo "    const { /* filters */ } = filters ?? {};" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    const ${SERVICE_NAME_LOWER_CASE}s = await this.$SERVICE_NAME_LOWER_CASE.findMany({" >> $FILE_PATH
echo "      where: {" >> $FILE_PATH
echo "        AND: []" >> $FILE_PATH
echo "      }," >> $FILE_PATH
echo "      skip: offset ?? undefined," >> $FILE_PATH
echo "      orderBy: [{ orderBy ?? 'created_at', order ?? 'desc' }]," >> $FILE_PATH
echo "      take: limit ? Number(limit) : undefined" >> $FILE_PATH
echo "    });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    return await this.${SERVICE_NAME_LOWER_CASE}.manyRessource(${SERVICE_NAME_LOWER_CASE}s);" >> $FILE_PATH
echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  public count = async ({ filters, trash }: count) => {" >> $FILE_PATH
echo "    const { /* filters */ } = filters ?? {};" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    return await this.${SERVICE_NAME_LOWER_CASE}.count({" >> $FILE_PATH
echo "      where: {" >> $FILE_PATH
echo "        AND: []" >> $FILE_PATH
echo "      }" >> $FILE_PATH
echo "    });" >> $FILE_PATH
echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  public get = async (id: get) => {" >> $FILE_PATH
echo "    if (!id) throw new HTTPException(400, { message: 'Id is required' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    const $SERVICE_NAME_LOWER_CASE = await this.$SERVICE_NAME_LOWER_CASE.findUnique({ where: { id } });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    if (!$SERVICE_NAME_LOWER_CASE) throw new HTTPException(404, { message: '${SERVICE_NAME_FIRST_LETTER_CAPITALIZED} not found' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    return await this.${SERVICE_NAME_LOWER_CASE}.ressource($SERVICE_NAME_LOWER_CASE);" >> $FILE_PATH
echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  public create = async (data: create) => {" >> $FILE_PATH
echo "    const { /* data */ } = data;" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    // Do something" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    const $SERVICE_NAME_LOWER_CASE = await this.$SERVICE_NAME_LOWER_CASE.create({ data: { /* data */ } });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    if (!$SERVICE_NAME_LOWER_CASE) throw new HTTPException(500, { message: 'Failed to create ${SERVICE_NAME_FIRST_LETTER_CAPITALIZED}' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    return await this.${SERVICE_NAME_LOWER_CASE}.ressource($SERVICE_NAME_LOWER_CASE);" >> $FILE_PATH

echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  public update = async ({id, data}: update) => {" >> $FILE_PATH
echo "    if (!id) throw new HTTPException(400, { message: 'Id is required' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    const $SERVICE_NAME_LOWER_CASE = await this.$SERVICE_NAME_LOWER_CASE.findUnique({ where: { id } });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    if (!$SERVICE_NAME_LOWER_CASE) throw new HTTPException(404, { message: '${SERVICE_NAME_FIRST_LETTER_CAPITALIZED} not found' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    // Do something" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    const updated$SERVICE_NAME_FIRST_LETTER_CAPITALIZED = await this.$SERVICE_NAME_LOWER_CASE.update({ where: { id }, data: { /* data */ } });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    return await this.${SERVICE_NAME_LOWER_CASE}.ressource(updated$SERVICE_NAME_FIRST_LETTER_CAPITALIZED);" >> $FILE_PATH

echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  public destroy = async (id: destroy) => {" >> $FILE_PATH
echo "    if (!id) throw new HTTPException(400, { message: 'Id is required' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    const $SERVICE_NAME_LOWER_CASE = await this.$SERVICE_NAME_LOWER_CASE.delete({ where: { id } });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    if (!$SERVICE_NAME_LOWER_CASE) throw new HTTPException(500, { message: 'Failed to delete ${SERVICE_NAME_FIRST_LETTER_CAPITALIZED}' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    return await this.${SERVICE_NAME_LOWER_CASE}.ressource($SERVICE_NAME_LOWER_CASE);" >> $FILE_PATH
echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  public destroyMany = async (ids: destroy[]) => {" >> $FILE_PATH
echo "    if (!ids) throw new HTTPException(400, { message: 'Ids are required' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    const ${SERVICE_NAME_LOWER_CASE}s = await this.$SERVICE_NAME_LOWER_CASE.deleteMany({ where: { id: { in: ids } } });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    if (!${SERVICE_NAME_LOWER_CASE}s) throw new HTTPException(500, { message: 'Failed to delete ${SERVICE_NAME_FIRST_LETTER_CAPITALIZED}' });" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "    return await this.${SERVICE_NAME_LOWER_CASE}.manyRessource(${SERVICE_NAME_LOWER_CASE}s);" >> $FILE_PATH
echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  protected ressource = async ($SERVICE_NAME_LOWER_CASE: any) => {" >> $FILE_PATH
echo "    return await ${SERVICE_NAME_LOWER_CASE}Ressource($SERVICE_NAME_LOWER_CASE);" >> $FILE_PATH
echo "  };" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "  protected manyRessource = async (${SERVICE_NAME_LOWER_CASE}s: any[]) => {" >> $FILE_PATH
echo "    const result = ${SERVICE_NAME_LOWER_CASE}s.map(async (${SERVICE_NAME_LOWER_CASE}: any) => await ${SERVICE_NAME_LOWER_CASE}Resource(${SERVICE_NAME_LOWER_CASE}));" >> $FILE_PATH
echo "    return await Promise.all(result);" >> $FILE_PATH
echo "  };" >> $FILE_PATH
echo "}" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "export default new ${SERVICE_NAME_FIRST_LETTER_CAPITALIZED}Service();" >> $FILE_PATH