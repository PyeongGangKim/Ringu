import React from 'react';

import Modal from '../../components/modal/Modal';
import '../../scss/author/format.scss';

function FormatDownloadModal({
    handleCloseClick
}) {
    const downloadFormat = (format) => {
        if (format === 0) {            
            window.location.assign('https://ringuimage.s3.ap-northeast-2.amazonaws.com/%eb%a7%81%ea%b5%ac+%ec%97%b0%ec%9e%ac%eb%b3%b8+%ed%8f%ac%eb%a7%b7(%ec%9b%8c%eb%93%9c).docx')
        }
        else if(format === 1) {
            window.location.assign('https://ringuimage.s3.ap-northeast-2.amazonaws.com/%eb%a7%81%ea%b5%ac+%eb%8b%a8%ed%96%89%eb%b3%b8+%ed%8f%ac%eb%a7%b7(%ec%9b%8c%eb%93%9c).docx')
        } 
        else if(format === 2) {
            window.location.assign('https://ringuimage.s3.ap-northeast-2.amazonaws.com/%eb%a7%81%ea%b5%ac+%ec%97%b0%ec%9e%ac%eb%b3%b8+%ed%8f%ac%eb%a7%b7(%ed%95%9c%ea%b8%80).hwp')
        }
        else {
            window.location.assign('https://ringuimage.s3.ap-northeast-2.amazonaws.com/%eb%a7%81%ea%b5%ac+%eb%8b%a8%ed%96%89%eb%b3%b8+%ed%8f%ac%eb%a7%b7(%ed%95%9c%ea%b8%80).hwp')
        }
    }

    return (
        <Modal
            onClose={handleCloseClick}
            overlay={true}
        >
            <div className="format-modal">
                <div className="header">
                    <span>원하는 양식을 다운로드 해주세요</span>
                </div>
                <em className="close" onClick={handleCloseClick}> &times; </em>

                <div className="format-download">
                    <table>
                        <thead>
                            <tr>
                                <th>연재본</th>
                                <th>단행본</th>
                            </tr>                            
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="item">
                                        <div className="type word">
                                            <em/>
                                            <span> 워드 파일 양식 </span>
                                        </div>
                                        <button className="download" onClick={() => downloadFormat(0)}>
                                            <em/>
                                        </button>
                                    </div>
                                </td>

                                <td>
                                    <div className="item">
                                        <div className="type word">
                                            <em/>
                                            <span> 워드 파일 양식 </span>
                                        </div>
                                        <button className="download" onClick={() => downloadFormat(1)}>
                                            <em/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="item">
                                        <div className="type hangeul">
                                            <em/>
                                            <span> 한글 파일 양식 </span>
                                        </div>
                                        <button className="download" onClick={() => downloadFormat(2)}>
                                            <em/>
                                        </button>
                                    </div>
                                </td>

                                <td>
                                    <div className="item">
                                        <div className="type hangeul">
                                            <em/>
                                            <span> 한글 파일 양식 </span>
                                        </div>
                                        <button className="download" onClick={() => downloadFormat(3)}>
                                            <em/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </Modal>
    )
}

export default FormatDownloadModal;