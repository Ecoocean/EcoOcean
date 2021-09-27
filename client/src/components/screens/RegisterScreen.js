import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../reusables/Loader";
import Message from "../reusables/Message";
import {register} from "../../actions/userActions";
import {validateEmail} from "../reusables/utils";
import { USER_REGISTER_RESET } from "../../constants/userConstants"

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const [message, setMessage] = useState("");

    const dispatch = useDispatch();

    const userRegister = useSelector((state) => state.userRegister);
    const {success, error, loading} = userRegister;

    useEffect(() => {
        dispatch({type: USER_REGISTER_RESET});
    }, [dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (email.length === 0) {
            setMessage("חשבון המייל לא יכול להיות ריק");
        } else if (!validateEmail(email)) {
            setMessage("פורמט מייל אינו תקין");
        } else if (name.length === 0) {
            setMessage("השם לא יכול להיות ריק");
        } else if (surname.length === 0) {
            setMessage("שם המשפחה לא יכול להיות ריק");
        } else if (password.length === 0) {
            setMessage("הסיסמה לא יכולה להיות ריקה");
        } else if (password !== passwordConfirm) {
            setMessage("הסיסמאות אינן תואמות");
        } else if (dateOfBirth.length === 0) {
            setMessage("אנא בחר/י תאריך לידה");
        } else {
            setMessage("");
            dispatch(register(name, surname, email, password, dateOfBirth));
        }
    };

    return (
        <Container className="offset_nav rtl text-right" id="register_screen">
            <Row>
                <Col xs={12}>
                    <h1>הרשמה</h1>
                    {success && <Message variant="success" text={success}/>}
                    {message && <Message variant="danger" text={message}/>}
                    {error && <Message variant="danger" text={error}/>}
                    {loading && <Loader/>}
                    <Form onSubmit={submitHandler}>
                        <Form.Group>
                            <Form.Label>
                                מייל<span className="red">*</span>
                            </Form.Label>
                            <Form.Control
                                id={"email_field"}
                                autoFocus
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg">
                            <Form.Label>
                                שם<span className="red">*</span>
                            </Form.Label>
                            <Form.Control
                                id={"first_name_field"}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg">
                            <Form.Label>
                                שם משפחה<span className="red">*</span>
                            </Form.Label>
                            <Form.Control
                                id={"last_name_field"}
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg">
                            <Form.Label>
                                סיסמה<span className="red">*</span>
                            </Form.Label>
                            <Form.Control
                                id={"password_field"}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg">
                            <Form.Label>
                                סיסמה שנית<span className="red">*</span>
                            </Form.Label>
                            <Form.Control
                                id={"password_repeat_field"}

                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="date_of_birth">
                            <Form.Label>תאריך לידה</Form.Label>
                            <Form.Control
                                id={"birth_date_field"}
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </Form.Group>
                        <Button block size="lg" type="submit" id={"submit_btn"}>
                            הרשמה
                        </Button>
                        <p className="mt-4">
                            יש לך משתמש? <Link to="/login">התחבר/י</Link>
                        </p>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterScreen;
