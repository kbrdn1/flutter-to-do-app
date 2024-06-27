# Bash Sscript for creating a new ressource file
# Usage: bun make:crud:ressource <ressource-name>

# Check if the ressource name is provided
if [ -z "$1" ]; then
    echo "Resource name is required"
    exit 1
fi

# Get the ressource name
RESSOURCE_NAME=$1

# Create ressource name variants
RESSOURCE_NAME_LOWER_CASE=$(echo $RESSOURCE_NAME | tr '[:upper:]' '[:lower:]')
RESSOURCE_NAME_FIRST_LETTER_CAPITALIZED=$(tr '[:lower:]' '[:upper:]' <<< ${RESSOURCE_NAME:0:1})${RESSOURCE_NAME:1}

# Check if the module directory exists, if not create it
if [ ! -d "src/modules/$RESSOURCE_NAME_LOWER_CASE" ]; then
    mkdir src/modules/$RESSOURCE_NAME_LOWER_CASE
fi

# Check if the ressource file exists
if [ -f "src/modules/$RESSOURCE_NAME_LOWER_CASE/$RESSOURCE_NAME_LOWER_CASE.ressource.ts" ]; then
    echo "Ressource file already exists"
    exit 1
fi

# Create the ressource file
FILE_PATH="src/modules/$RESSOURCE_NAME_LOWER_CASE/$RESSOURCE_NAME_LOWER_CASE.ressource.ts"
touch $FILE_PATH

# Print the ressource file content
echo "// Ressource for $RESSOURCE_NAME_LOWER_CASE - ${RESSOURCE_NAME_FIRST_LETTER_CAPITALIZED}.ressource.ts" >> $FILE_PATH
echo "import { ${RESSOURCE_NAME_FIRST_LETTER_CAPITALIZED} } from '@/types/models'" >> $FILE_PATH
echo "import { prisma } from '@/middleware'" >> $FILE_PATH
echo "import { HTTPException } from 'hono/http-exception'" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "const ${RESSOURCE_NAME_LOWER_CASE}Ressource = async (${RESSOURCE_NAME_LOWER_CASE}: any): Promise<${RESSOURCE_NAME_FIRST_LETTER_CAPITALIZED}> => {" >> $FILE_PATH
echo "    return {}" >> $FILE_PATH
echo "}" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "export default ${RESSOURCE_NAME_LOWER_CASE}Ressource" >> $FILE_PATH