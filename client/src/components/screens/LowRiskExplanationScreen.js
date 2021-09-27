import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';

const LowRiskExplanationScreen = () => {
    const navigate = useNavigate();
    return (
        <Container className="offset_nav rtl text-right" id="low_risk_explanation_screen">
            <Row>
                <Col xs={12}>
                    <h1>למה הגעתי לפה?</h1>
                    <p>לאחר קבלת התוצאות מהמענה על השאלון, נראה כי בחרת במעט מידי סיכון על מנת לקבל הצעה סבירה עם סיכון
                        זה מהמודל שנבחר.</p>
                    <p>האפשרויות הן: שימוש במודל אחר או בתשובות אשר מייצגות רצון לקחת מעט יותר סיכון מהתשובות הקודמות
                        שבחרת.</p>
                    <Button onClick={() => navigate(-1)}>חזרה לשאלון</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default LowRiskExplanationScreen;
