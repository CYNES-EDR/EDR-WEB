interface Condition {
  field: string;
  operator: string;
  value: string;
}

const parseInput = (input: string): Condition[] => {
  const conditions: Condition[] = [];
  // Update regex to include the LIKE operator
  const regex = /(\w+)\s*(=|>=|<=|>|<|:|LIKE)\s*([\w.\s%-]+)/gi;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const [, field, operator, value] = match;
    conditions.push({ field, operator, value: value.trim() });
  }

  return conditions;
};

export default parseInput;
