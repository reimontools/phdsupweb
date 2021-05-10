import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX, PRIMARY_COLOR } from "../../helpers/paramHelper";

const TableStyled = styled.table `
    width: 100%;
    border-collapse: collapse;
    margin: ${({ margin }) => margin ? margin : '0'};
    thead {
        background: ${PRIMARY_COLOR};
    };
    thead tr th {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.35px;
        color: #FFFFFF;
        padding: 12px;
        vertical-align: center;
        height: 45px;
    };
    thead tr th:first-child {
        border-radius: 5px 0 0 0
    };
    thead tr th:last-child {
        border-radius: 0 5px 0 0
    };
    tbody tr td {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.35px;
        padding: 8px;
        text-align: center;   
    };
    tbody tr:hover td {
        background-color: #dddd;
        cursor: pointer;
    };
    .td-container {
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        color: #222;
        border-collapse: separate; 
        border-spacing: 0 10px; 

        thead {
            display: none;
        };

        .head {
            display:flex;
            font-weight: 600;
            font-size: 15px;
            color: ${PRIMARY_COLOR};
        };

        .content {
            padding-left: 40%;
            display: flex;
            justify-content: flex-end;
        };

        .hide {
            display:none;
        };

        .unhide {
            display:flex;
        };

        .td-container {
            justify-content: space-around;
            width: 100%;
        };

        tbody tr td {
            position: relative;
        };

        tbody tr td:before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 40%;
            color: #222;
            padding-left: 8px;
            text-align: left;
        };

        tbody tr td:first-child {
            border-bottom: solid 1px #66316563;
        };

        tbody tr:hover td {
            background-color: transparent;
        };
    };
`;

const Table = {
    Basic: ({children, ...tableProps}) => {
        return (
            <TableStyled {...tableProps}>
                {children}
            </TableStyled>
        );
    }
};

export default Table;