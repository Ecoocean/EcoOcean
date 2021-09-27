import React, {useState, useEffect, useMemo} from "react";
import {Container, Row, Col, Button, Table, Form, ButtonGroup} from "react-bootstrap";
import queryString from "query-string";
import {
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import Message from "../reusables/Message";

import axios from "axios";
import {API_PREFIX} from "../../constants/apiConstants";

import {Link, useNavigate, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {portfolioFetch} from "../../actions/portfolioActions";
import Loader from "../reusables/Loader";

// const COLORS1 = ["#2b2e4a", "#e84545", "#903749", "#53354a"];
// const COLORS1  = ["#f39189", "#bb8082", "#6e7582", "#046582"];
// const COLORS1 = ["#440a67", "#93329e", "#b4aee8", "#ffe3fe"];
const COLORS1 = ["#693c72", "#c15050", "#d97642", "#d49d42"];
const ignoreFilter = 0.005;
// const assets_mapper = (x) => {name: x.stock_price_ticker, value: x}

const PortfolioScreen = () => {
    const {link} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchedPortfolio = useSelector((state) => state.portfolioFetch);
    const {loading, error, portfolio} = fetchedPortfolio;
    useEffect(() => {
        dispatch(portfolioFetch(link));
    }, [dispatch, portfolioFetch]);

    const userLogin = useSelector((state) => state.userLogin);
    const {userInfo} = userLogin;

    const copyToClipboard = () => {
        let copyTextarea = document.getElementById('location_field');
        copyTextarea.focus();
        copyTextarea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    }

    if (error && error.length > 0) {
        return (<div className="rtl offset_nav" id="portfolio_wrapper"><Container>
            <Message variant="danger" text={error}/>
        </Container>
        </div>);
    }
    if (loading || !portfolio) {
        return <Loader/>;
    } else {
        const {data} = portfolio;
        const parsedData = data.map((x) => {
            return {
                asset_type: x.asset_type,
                name: x.stock_price_ticker,
                value: parseFloat(x.weight),
            };
        });
        const filteredData = parsedData.filter((x) => x.value > ignoreFilter);
        const stocksBonds = filteredData.reduce(
            (accumulator, currentValue) => {
                if (currentValue.asset_type === "stock") {
                    accumulator[0].value += currentValue.value;
                } else {
                    accumulator[1].value += currentValue.value;
                }
                accumulator[2].value -= currentValue.value;
                return accumulator;
            },
            [
                {name: "Stocks", value: 0},
                {name: "Bonds", value: 0},
                {name: "Not allocated", value: 1.0},
            ]
        );

        const stocksAllocation = filteredData.filter(
            (x) => x.asset_type === "stock"
        );
        const bondsAllocation = filteredData.filter((x) => x.asset_type === "bond");

        const rebalance = () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.access_token}`,
                },
            };
            try {
                if (
                    window.confirm(
                        "שים לב כי פעולת האיזון מחדש לוקחת זמן ועל כן מומלץ לצפות בעמוד התוצאות האחרונות בפרופיל האישי כמספר דקות לאחר איתחול התהליך, האם לאשר איזון מחדש?"
                    )
                ) {
                    axios.post(
                        `${API_PREFIX}/rebalance/rebalanced`,
                        {link: link},
                        config
                    );
                    // dispatch(portfolioFetch(data.new_link));
                    navigate("/user_latest_results");
                    // console.log(data);
                }
            } catch (e) {
                console.error(e);
            }
        };

        return (
            <div className="rtl offset_nav" id="portfolio_wrapper">
                <Container>
                    <Row style={{marginBottom: "2rem"}}>
                        {userInfo && (
                            <Col xs={2}>
                                <Button block size="sm" id={"rebalance_btn"} onClick={rebalance}>
                                    איזון מחדש
                                </Button>
                            </Col>
                        )}
                        <Col xs={10} style={{textAlign: "right"}}>
                            <div>העתקת לינק שיתוף</div>
                            <ButtonGroup>
                                <Form.Control
                                    id={"location_field"}
                                    type="text"
                                    value={window.location.href}
                                />
                                <Button onClick={() => copyToClipboard()}>
                                    <span className={'lnr lnr-paperclip'}></span>
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} style={{textAlign: "center"}}>
                            <h2>מניות</h2>
                        </Col>
                        <Col xs={4} style={{textAlign: "center"}}>
                            <h2>חלוקה</h2>
                        </Col>
                        <Col xs={4} style={{textAlign: "center"}}>
                            <h2>איגרות חוב</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="pie_chart_container_col">
                            <ResponsiveContainer height="100%" width="100%">
                                <PieChart>
                                    <Pie data={stocksAllocation} dataKey="value" nameKey="name">
                                        {stocksAllocation.map((item, index) => (
                                            <Cell
                                                key={index}
                                                strokeWidth={0}
                                                fill={COLORS1[index % COLORS1.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col xs={4} className="pie_chart_container_col">
                            <ResponsiveContainer height="100%" width="100%">
                                <PieChart>
                                    <Pie data={stocksBonds} dataKey="value" nameKey="name">
                                        {stocksBonds.map((item, index) => (
                                            <Cell
                                                key={index}
                                                strokeWidth={0}
                                                fill={COLORS1[index % COLORS1.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col xs={4} className="pie_chart_container_col">
                            <ResponsiveContainer height="100%" width="100%">
                                <PieChart>
                                    <Pie data={bondsAllocation} dataKey="value" nameKey="name">
                                        {bondsAllocation.map((item, index) => (
                                            <Cell
                                                key={index}
                                                strokeWidth={0}
                                                fill={COLORS1[index % COLORS1.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            className="rtl text-right"
                            style={{marginTop: "3rem"}}
                            xs={12}
                        >
                            <h4>הערה:</h4>
                            <p>
                                אם מופיע בתרשים האמצעי לעיל חלק אשר מוגדר כחלק אשר לא הוקצה אז
                                מדובר במשקלים קטנים שהאלגוריתם נתן לאותו נייר ערך, אנו נתעלם
                                ממשקלים אלו, כרגע המשקל מוגדר להיות {ignoreFilter}
                            </p>
                        </Col>
                    </Row>

                    <Row style={{marginTop: "3rem"}}>
                        <Col xs={12}>
                            <h2>חלוקת התיק</h2>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>מזהה נייר ערך</th>
                                    <th>סוג נייר ערך</th>
                                    <th>אחוז מכלל התיק</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.map((x, i) => (
                                    <tr key={i}>
                                        <td>{x.name}</td>
                                        <td>{x.asset_type}</td>
                                        <td>{(x.value * 100).toFixed(3)}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
};

export default PortfolioScreen;
