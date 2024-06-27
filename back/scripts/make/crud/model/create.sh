# Bash script for creating a new model file
# Usage: bun make:crud:model <model-name>

# Check if the model name is provided
if [ -z "$1" ]; then
    echo "Model name is required"
    exit 1
fi

# Get the model name
MODEL_NAME=$1

# Create model name variants
MODEL_NAME_FIRST_LETTER_CAPITALIZED="$(tr '[:lower:]' '[:upper:]' <<< ${MODEL_NAME:0:1})${MODEL_NAME:1}"

# Check if the types and models directories exist, if not create them
if [ ! -d "src/types" ]; then
    mkdir "src/types"
fi

if [ ! -d "src/types/models" ]; then
    mkdir "src/types/models"
fi

# Check if the model already exists
if [ -f "src/types/models/${MODEL_NAME_FIRST_LETTER_CAPITALIZED}.d.ts" ]; then
    echo "Model already exists"
    exit 1
fi

# Ask field names w/ types
# 1. Ask for field name
# 2. Ask for field type
# 3. Store the field name and type in an array

FIELDS_ARRAY=()

while true; do
    read -p "Enter field name: " FIELD_NAME
    read -p "Enter field type: " FIELD_TYPE

    FIELDS_ARRAY+=("$FIELD_NAME:$FIELD_TYPE")

    read -p "Do you want to add another field? (y/n): " ADD_ANOTHER_FIELD

    if [ "$ADD_ANOTHER_FIELD" != "y" ]; then
        break
    fi
done

# Print the fields array
echo "Model name: ${MODEL_NAME_FIRST_LETTER_CAPITALIZED}"
echo "Fields: ${FIELDS_ARRAY[@]}"

# Create the model file
FILE_PATH="src/types/models/${MODEL_NAME_FIRST_LETTER_CAPITALIZED}.d.ts"
touch $FILE_PATH

# Add the model content
echo "// Type definition for ${MODEL_NAME_FIRST_LETTER_CAPITALIZED} model - ${MODEL_NAME_FIRST_LETTER_CAPITALIZED}.d.ts" >> $FILE_PATH
echo "type ${MODEL_NAME_FIRST_LETTER_CAPITALIZED} = {" >> $FILE_PATH

echo "" >> $FILE_PATH

for FIELD in "${FIELDS_ARRAY[@]}"
do
    IFS=':' read -r -a FIELD_ARRAY <<< "$FIELD"
    echo "    ${FIELD_ARRAY[0]}: ${FIELD_ARRAY[1]};" >> $FILE_PATH
done

echo "};" >> $FILE_PATH

echo "" >> $FILE_PATH


echo "export default ${MODEL_NAME_FIRST_LETTER_CAPITALIZED};" >> $FILE_PATH

echo "Model created successfully !, check ${FILE_PATH} file"

# Add the model to the index file

# If the index file does not exist, create it
if [ ! -f "src/types/models/index.ts" ]; then
    touch "src/types/models/index.ts"
    echo "// Models types exoports - index.ts" >> "src/types/models/index.ts"
fi

# Add the model to the index file
echo "export { default as ${MODEL_NAME_FIRST_LETTER_CAPITALIZED} } from './${MODEL_NAME_FIRST_LETTER_CAPITALIZED}';" >> "src/types/models/index.ts"

echo "Model added to the index file"