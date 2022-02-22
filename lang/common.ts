export default {
  message: {
    error: {
      invalidPlayerTag: (tag: String) => `Oups ! Seems like the tag \`${tag}\` is invalide !`,
      missingPlayerTag: (command: String) => `Oups! It seems like you forgot to enter your player tag. Type \`${command}\``,
      invalidCommand: () => 'Oups! It seems like this command does not exist !',
      notRegistered: () => 'You need to register first before using this bot\'s commands. Type `$register {playerTag}`',
    },
  },
};
