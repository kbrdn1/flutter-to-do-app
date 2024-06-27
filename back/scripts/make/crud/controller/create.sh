# Bash script for creating a new controller file
# Usage: bun make:crud:controller <controller_name>

# Check if the controller name is provided
if [ -z "$1" ]
then
  echo "Controller name is required"
  exit 1
fi

# Get the controller name
CONTROLLER_NAME=$1

# Create controller name variants
CONTROLLER_NAME_LOWER_CASE="$(tr '[:upper:]' '[:lower:]' <<< $CONTROLLER_NAME)"
CONTROLLER_NAME_FIRST_LETTER_CAPITALIZED="$(tr '[:lower:]' '[:upper:]' <<< ${CONTROLLER_NAME:0:1})${CONTROLLER_NAME:1}"

# Chech if the module directory exists, if not create it
if [ ! -d "src/modules/$CONTROLLER_NAME_LOWER_CASE" ]
then
  mkdir src/modules/$CONTROLLER_NAME_LOWER_CASE
fi

# Check if the controller file exists
if [ -f "src/modules/$CONTROLLER_NAME_LOWER_CASE/$CONTROLLER_NAME_LOWER_CASE.controller.ts" ]
then
  echo "Controller file already exists"
  exit 1
fi

# Create the controller file
FILE_PATH="src/modules/$CONTROLLER_NAME_LOWER_CASE/$CONTROLLER_NAME_LOWER_CASE.controller.ts"
touch $FILE_PATH

# Print the controller file content
echo "// Controller for $CONTROLLER_NAME - ${CONTROLLER_NAME_LOWER_CASE}.controller.ts" >> $FILE_PATH
echo "import DefaultCRUDController from '@/components/DefaultCRUDController';" >> $FILE_PATH
echo "import ${CONTROLLER_NAME_LOWER_CASE}Service from './$CONTROLLER_NAME_LOWER_CASE.service';" >> $FILE_PATH

echo "" >> $FILE_PATH

echo "class ${CONTROLLER_NAME_FIRST_LETTER_CAPITALIZED}Controller extends DefaultCRUDController {" >> $FILE_PATH
echo "  constructor() {" >> $FILE_PATH
echo "    super('/$CONTROLLER_NAME_LOWER_CASE', ${CONTROLLER_NAME_LOWER_CASE}Service, true);" >> $FILE_PATH
echo "  }" >> $FILE_PATH
echo "}" >> $FILE_PATH

echo "" >> $FILE_PATH
echo "export default new ${CONTROLLER_NAME_FIRST_LETTER_CAPITALIZED}Controller();" >> $FILE_PATH

echo "Controller file created successfully, you can find it at src/modules/$CONTROLLER_NAME_LOWER_CASE/$CONTROLLER_NAME.controller.ts"