enum ErrorMessage {
  INVALID_CREDENTIALS = '이메일 또는 비밀번호가 잘못되었습니다.',
  EMAIL_EXISTS = '이메일이 이미 존재합니다',
  NICKNAME_EXISTS = '닉네임이 이미 존재합니다',
  NICKNAME_LENGTH = '닉네임은 2자 이상 12자 이하로 입력해주세요',
  UNAUTHORIZED = '인증되지 않은 사용자입니다.',
  INCORRECT_ROLE = '올바른 권한이 없습니다.',
}

export default ErrorMessage;
