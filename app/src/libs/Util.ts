
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    console.log('url error', _);
    return false;
  }
}

const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/gi;

export function parseEmails(s: string): string[] {
  // clean up the email addresses
  const emailList = [...(s || "").matchAll(EMAIL_REGEX)].map(a => a[0]);
  // make the list unique by converting to a set temporarily
  return [...new Set([...emailList])];
}

export function arrayRemove(list, ...vals) {
  let count = 0;
  vals.forEach(val => {
    const pos = list.indexOf(val);
    if (pos > -1) {
      list.splice(pos, 1);
      count++;
    }
  });
  return count;
}

export function diffLists<T>(newList: T[], oldList: T[]): {dups: T[], added: T[], removed: T[]} {
  // we could reduce this by one iteration by only iterating
  // newList once and storing added and dups at the same time
  return {
    dups: newList.filter(e => oldList.includes(e)),
    added: newList.filter(e => !oldList.includes(e)),
    removed: oldList.filter(e => !newList.includes(e))
  };
}

export function findOrCreate(obj: object, defaultVal: any, ...keys: string[]) {
  const key = keys[0];
  if( !(key in obj) ) {
    obj[key] = keys.length > 1? {} : defaultVal;
  }
  if( keys.length > 1 ) {
    return findOrCreate(obj[key], defaultVal, ...keys.slice(1));
  }
  else {
    return obj[key];
  }
}

export default {
  isValidUrl, parseEmails, arrayRemove, diffLists, findOrCreate
}