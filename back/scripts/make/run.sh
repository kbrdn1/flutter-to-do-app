# Bash Sscript for creating a new module
# Usage: bun make:module <module-name>

# Check if the controller name is set
if [ -z "$1" ]; then
    echo "Controller name is required"
    exit 1
fi

# Check if the controller already exists
if [ -f "src/$1/$1.controller.ts" ]; then
    echo "Controller already exists"
    exit 1
fi

# Get the module name
MODULE_NAME=$1

# Create module name variants
MODULE_NAME_LOWER_CASE=$(tr '[:upper:]' '[:lower:]' <<< $MODULE_NAME)
MODULE_NAME_FIRST_LETTER_CAPITALIZED="$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}"

# Create module entry file
bun make:model $MODULE_NAME
bun make:controller $MODULE_NAME
bun make:service $MODULE_NAME
bun make:ressource $MODULE_NAME

echo "Module $MODULE_NAME created successfully, you can now start using it in src/modules/$MODULE_NAME"