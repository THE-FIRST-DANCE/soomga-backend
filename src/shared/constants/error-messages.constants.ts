enum ErrorMessage {
  INVALID_CREDENTIALS = '이메일 또는 비밀번호가 잘못되었습니다.',
  EMAIL_EXISTS = '이메일이 이미 존재합니다',
  NICKNAME_EXISTS = '닉네임이 이미 존재합니다',
  NICKNAME_LENGTH = '닉네임은 2자 이상 12자 이하로 입력해주세요',
  UNAUTHORIZED = '인증되지 않은 사용자입니다.',
  INCORRECT_ROLE = '올바른 권한이 없습니다.',
  ALREADY_REGISTERED = '이미 가입된 사용자입니다.',
  NOT_REGISTERED = '가입되지 않은 사용자입니다.',
  NO_CHANGES = '변경된 내용이 없습니다.',
  FORBIDDEN_MEMBER = '탈퇴한 회원이거나 비활성화된 회원입니다.',
  NOTFOUND_REVIEW = '리뷰를 찾을 수 없습니다.',
  PERMISSION_DENIED = '권한이 없습니다.',
  PHONE_NUMBER_ALREADY_EXISTS = '이미 등록된 전화번호입니다.',
  INVALID_AUTH_CODE = '인증코드가 일치하지 않습니다.',
  TOO_MANY_ATTEMPTS = '인증코드 요청 횟수를 초과하였습니다.',
}

export default ErrorMessage;
