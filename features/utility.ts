/**
 * Returns true if an array has duplicates
 * @param  { Array<String> } arr 
 * @return { Boolean }
 */
export const checkDiff = (arr: Array<String>): Boolean => {
    return (new Set(arr)).size !== arr.length;
}