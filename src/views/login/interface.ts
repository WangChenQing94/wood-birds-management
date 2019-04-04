import { FormComponentProps } from 'antd/lib/form';

export interface LoginProps extends FormComponentProps {
  loginName: string,
  password: string
}