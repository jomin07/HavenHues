export const getSender = (loggedUser: any, users: any[]) => {
  return users[0]?._id === loggedUser?.userID
    ? `${users[1].firstName} ${users[1].lastName}`
    : `${users[0].firstName} ${users[0].lastName}`;
};

export const isSameSender = (
  messages: any[],
  m: any,
  i: number,
  userId: string
) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages: any[], i: number, userId: string) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (
  messages: any[],
  m: any,
  i: number,
  userId: string
) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages: any[], m: any, i: number) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
