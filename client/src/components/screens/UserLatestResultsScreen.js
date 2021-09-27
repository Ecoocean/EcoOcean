import React, {useEffect} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import LatestResults from "../reusables/LatestResults";

const UserLatestResultsScreen = () => {
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const {userInfo} = userLogin;

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    return (
        <Container className="offset_nav rtl text-right">
            <Row>
                <Col xs={12}>
                    {userInfo && <LatestResults byUser={userInfo.email}/>}
                </Col>
            </Row>
        </Container>
    );
};

export default UserLatestResultsScreen;
