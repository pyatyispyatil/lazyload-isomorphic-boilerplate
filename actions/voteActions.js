export const action = {
  INCREMENT: '++',
  DECREMENT: '--',
  RESET: '0'
};

export function increment(vote) {
  return {...vote, rating: vote.rating + 1};
}

export function decrement(vote) {
  return {...vote, rating: vote.rating - 1};
}

export function reset(vote) {
  return {...vote, rating: 0};
}
