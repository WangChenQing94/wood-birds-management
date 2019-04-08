import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router-dom';

// 需要继承antd的FormComponentProps和react-router-dom的RouteComponentProps的属性和方法
export interface LoginProps extends FormComponentProps, RouteComponentProps {
  loginName: string,
  password: string,
}