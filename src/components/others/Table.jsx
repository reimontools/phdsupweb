import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const TableStyled = styled.table `
    width: 100%;
    border-collapse: collapse;
    thead {
        background: #663165;
    };
    thead tr th {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.35px;
        color: #FFFFFF;
        padding: 12px;
        vertical-align: top;
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
        &.active {
            color: green;
        };
        &.finished {
            color: blue;
        };
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
        border-radius: 10px;
        thead {
            display: none;
        };
        tbody, tr, td  {
            display: block;
            width: 100%;
            
        };
        tbody tr {
            margin-bottom: 15px;
        };
        tbody tr td {
            text-align: right;
            padding-left: 40%;
            position: relative;
            background-color: #d1ebf7;
            word-wrap: break-word;
        };
        tbody tr td:before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 40%;
            color: #222;
            padding-left: 8px;
            font-weight: 600;
            font-size: 14px;
            text-align: left;
        };
        tbody tr td:first-child {
            border-radius: 5px 5px 0 0
        };
        tbody tr td:last-child {
            border-radius: 0 0 5px 5px
        };
        .td-container {
            padding-left: 65%;
            justify-content: space-between;
        };
    };

`;

const Table = {
    Primary: ({children}) => {
        return (
            <TableStyled>
                {children}
            </TableStyled>
        );
    }
};

export default Table;