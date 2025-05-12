import * as Yup from "yup";

export const SignUpSchema = Yup.object().shape({
    lastName: Yup.string().required('Фамилия обязательна'),
    firstName: Yup.string().required('Имя обязательно'),
    middleName: Yup.string(),
    phone: Yup.string()
        .matches(/\+7\d{10}$/, 'Некорректный номер')
        .required('Номер телефона обязателен'),
    email: Yup.string().email('Некорректный email').required('Email обязателен'),
});