function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export default function arrayRemoveDuplicates(array){
  return array.filter(onlyUnique);
}
