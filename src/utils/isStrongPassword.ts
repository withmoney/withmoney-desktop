/* @ts-ignore */
import merge from 'validator/lib/util/merge';
/* @ts-ignore */
import assertString from 'validator/lib/util/assertString';
var upperCaseRegex = /^[A-Z]$/;
var lowerCaseRegex = /^[a-z]$/;
var numberRegex = /^[0-9]$/;
var symbolRegex = /^[-#!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]$/;
var defaultOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};
/* Counts number of occurrences of each char in a string
 */

function countChars(str: any) {
  var result: any = {};
  Array.from(str).forEach(function (_char: any) {
    var curVal = result[_char];

    if (curVal) {
      result[_char] += 1;
    } else {
      result[_char] = 1;
    }
  });
  return result;
}
/* Return information about a password */

function analyzePassword(password: string) {
  var charMap = countChars(password);
  var analysis = {
    length: password.length,
    uniqueChars: Object.keys(charMap).length,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numberCount: 0,
    symbolCount: 0,
  };
  Object.keys(charMap).forEach(function (_char2: any) {
    if (upperCaseRegex.test(_char2)) {
      analysis.uppercaseCount += charMap[_char2];
    } else if (lowerCaseRegex.test(_char2)) {
      analysis.lowercaseCount += charMap[_char2];
    } else if (numberRegex.test(_char2)) {
      analysis.numberCount += charMap[_char2];
    } else if (symbolRegex.test(_char2)) {
      analysis.symbolCount += charMap[_char2];
    }
  });
  return analysis;
}

function scorePassword(analysis: any, scoringOptions: any) {
  var points = 0;
  points += analysis.uniqueChars * scoringOptions.pointsPerUnique;
  points += (analysis.length - analysis.uniqueChars) * scoringOptions.pointsPerRepeat;

  if (analysis.lowercaseCount > 0) {
    points += scoringOptions.pointsForContainingLower;
  }

  if (analysis.uppercaseCount > 0) {
    points += scoringOptions.pointsForContainingUpper;
  }

  if (analysis.numberCount > 0) {
    points += scoringOptions.pointsForContainingNumber;
  }

  if (analysis.symbolCount > 0) {
    points += scoringOptions.pointsForContainingSymbol;
  }

  return points;
}

export default function isStrongPassword(str: any) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  assertString(str);
  var analysis = analyzePassword(str);
  options = merge(options || {}, defaultOptions);

  if (options.returnScore) {
    return scorePassword(analysis, options);
  }

  return (
    analysis.length >= options.minLength &&
    analysis.lowercaseCount >= options.minLowercase &&
    analysis.uppercaseCount >= options.minUppercase &&
    analysis.numberCount >= options.minNumbers &&
    analysis.symbolCount >= options.minSymbols
  );
}