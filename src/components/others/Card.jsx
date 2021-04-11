import styled from "styled-components";

const CardStyled = styled.div `
    width: 100%;
    padding: 10px;
    div.card-head {
        width: 100%;
        /* font-size: 15px; */
        /* color: rgb(55, 55, 55); */
        /* font-family: sundayBest; */
        font-weight: 700;
        text-align: center;
    };
    div.card-body {
        width: 100%;
    };
`;


const Card = {
    Primary: ({children, ...formTextProps}) => {
        return ( 
            <CardStyled>
                <div className="card-head">{formTextProps.title}</div>
                <div className="card-body">
                    {children}
                </div>
            </CardStyled>
        );
    }
};

export default Card;