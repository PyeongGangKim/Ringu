import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select'

import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import iamport from '../../config/iamport';

import Cookies from 'js-cookie';

class RegisterAuthorDetail extends Component {
    user = User.getInfo();
    constructor(props) {
        super(props)

        this.bankOptions = []

        if(this.user === null) {
            alert("로그인이 필요합니다.")
            window.location.href = URL.service.accounts.login
            return;
        }

        if(this.user.type === 1) {
            alert("이미 작가로 등록하였습니다.")
            window.location.href = URL.service.home
            return;
        }

        this.state = {
            name: {val: "", msg: "", clear: false, class: "input"},
            phone: {val: "", msg: "", clear: false, class: "input"},
            bank: {val: {}, msg: "", clear: false, class: "input"},
            account: {val: "", msg: "", clear: false, class: "input"},
            tax_term: `
            · 지속적으로 링구를 통해 서비스를 판매하는 판매자는 사업자 등록 후 서비스를 판매하시기를 권합니다.
            · 사업자 등록은 사업 개시 후 20일 이내에 사업장 소재지 관할 세무서에서 신청하시면 됩니다.
            · 사업자 등록 없이 사업을 영위하는 경우 다음과 같은 가산세 부담 등의 불이익을 받게 됩니다.


            만약 사업자 등록없이 지속적으로 서비스를 판매할 경우 다음과 같은 불이익을 받으실 수 있음을 알려드립니다.


            1. 사업자등록 없이 이루어진 거래에 대하여 공급가액의 1% (간이과세자는 공급대가의0.5%) 미등록 가산세 부담
            2. 사업자등록 없이 사업을 영위하는 경우, 세금계산서의 교부가 불가능하며 관련 매입세액을 공제받을 수 없음
            3. 사업자등록을 하지 아니하여 부가가치세를 신고하지 못한 사업장의 거래에 대하여는 신고불성실 가산세와 납부불성실 가산세 추가 부담
            - 신고불성실 가산세: 무신고,과소신고의 경우 신고하지 아니한 납부세액의 10% 가산세 부담
            - 납부불성실 가산세: 무납부,과소납부의 경우 미납부 또는 과소 납부세액의 1일 0.03%(연간 10.95%)의 가산세 부담
            4. 소득세를 신고하지 않은 경우 신고불성실 가산세와 납부불성실 가산세 추가 부담(주민세 별도10%)
            - 신고불성실가산세: 산출세액에서 무신고나 과소신고 해당 비율에 대하여 20% 가산세 부담
            - 납부불성실 가산세: 무납부,과소납부의 경우 미납부 또는 과소 납부세액의 1일 0.03%(연간 10.95%)의 가산세 부담
            5. 상기 불이익 이외에 조세범처벌법 등 관련법규에 따라 처벌
            6. 또한, 링구에서 서비스를 판매한 모든 판매자들의 판매자료(현금영수증 발행내역과 카드결제내역)는 국세청의 요청에 따라 제공될 수 있음을 알려드립니다.
            특히 과세기간(6개월)동안 판매대금이 600만원 이상인 고객께서는 반드시 사업자 등록을 해주시기 바랍니다.
            `,
            promotion_term: `
            제1조 (목적)
            본 약관은 서비스를 판매 · 홍보하는 회사 링구(이하 “회사")와 링구에 입점하여 서비스를 판매하는 작가(이하 “작가") 사이에 체결된 입점 계약에 따른 권리 · 의무 및 책임사항을 규정하여 신뢰와 협조로써 계약 내용을 준수하여 상호 발전에 기여하는 데 있습니다.
            
            제2조 (용어의 정의)
            이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            가. "서비스"란 "작가"가 "계약"에서 약정한 바에 따라 “구매자”에게 제공하는 작업물, 활동, 편익, 만족 등 일체를 포괄합니다.
            나. "판매 기간"이란 "회사"가 "계약"에서 정한 기간 동안 “회사의 웹사이트 및 모바일 앱”상에서 서비스 판매 · 홍보를 진행하는 기간을 말합니다.
            다. “콘텐츠" 또는 “게시글”이란 “작가"가 “서비스"를 판매하기 위해 “웹사이트"에 게재한 정보 일체를 포괄합니다.
            
            제3조 (계약기간)
            계약기간은 계약 체결일로부터 판매 기간 동안 판매한 모든 서비스의 절차가 완료되는 날짜까지의 기간을 의미합니다.
            
            제4조 (약관의 명시, 효력 및 개정)
            가. 이 약관은 작가가 서비스를 판매·홍보함에 있어 이 약관의 내용이 적용됨을 확인 및 승인함으로써 효력이 발생합니다.
            나. 이 약관의 일부 조항에 대한 무효는 다른 조항의 효력에 영향을 미치지 않습니다.
            다. 회사가 이 약관을 개정하는 경우에는 개정된 약관의 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 그 적용일자 7일(다만, 작가에게 불리한 내용으로 변경하는 경우에는 30일) 이전부터 적용일자 전일까지 링구 서비스 이용약관에 명시된 방법으로 공지합니다. 개정된 약관은 개정된 약관에서 소급효를 부여하지 않는 이상 적용일자 이전으로 소급하여 적용되지 아니합니다.


            제5조 (계약상 업무내용)
            가. 회사의 업무내용
            1) 회사는 작가가 회사가 제공한 양식에 맞춰 등록한 정보를 회사가 정한 기준에 따라 검토 및 승인하여 링구 웹사이트 또는 모바일 링구에 노출합니다. 
            2) 회사는 사전에 작가가 등록한 정보를 확인하고, 해당 정보의 사실 및 허위/과장 여부를 판단하기 위해 작가에게 확인 및 증빙 자료 제출을 요청할 수 있습니다.
            3) 작가가 회사에 제공한 증빙자료는 이용목적을 달성한 이후 즉시 폐기합니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다. 
            4) 회사는 위의 가.항의 채널과 회사가 제휴한 사이트, SNS 채널을 적극 활용하여 작가의 서비스를 홍보합니다.
            나. 작가의 업무내용
            1) 작가는 회사가 제공한 양식에 따라 판매에 필요한 정보를 사실대로 등록하며, 회사의 판매 검토 및 승인 절차에 협조합니다.  
            2) 작가는 판매 시점으로부터 계약에서 정한 계약기간 만료일까지 구매자에게 웹사이트에 명시된 서비스를 제공합니다.
            3) 작가는 제공하는 서비스에 대한 품질 관리 및 구매자에 대한 판매 책임을 부담합니다.
            4) 회사가 승인한 내용과 작가가 실제 제공하는 서비스가 다름으로 인하여 발생하는 문제는 전적으로 작가의 책임으로 합니다.
            5) 작가는 서비스를 임의로 변경, 가공, 교환 등을 하지 않고 회사가 승인한 내용으로 서비스를 제공합니다.
            
            제6조 (민원처리)
            민원처리에 있어 작가의 귀책사유가 발견될 경우, 해당 민원에 대한 처리와 관련하여 발생하는 비용과 손해에 대해서는 작가의 책임으로 합니다.
            
            제7조 (계약의 책임)
            가. 작가는 서비스 내용에 타인의 명예나 권리(지적 재산권 포함), 사회윤리 및 공공의 안녕질서를 침해하는 내용의 정보나 사실과 상이한 정보를 포함시켜서는 안되며, 이를 위반할 경우 발생되는 제반 분쟁 및 문제 해결에 대하여 전적인 책임을 집니다.
            나. 작가는 이외에도 링구 서비스 이용약관 제15조(중개서비스 이용정지, 이용제한)의 각호에 해당하는 행위를 할 수 없으며, 이를 위반할 경우 발생되는 분쟁 및 문제의 해결과 기타 조치에 대해 전적인 책임을 집니다.
            다. 작가가 본 조항의 의무 위반으로 회사가 민·형사상 분쟁에 처하게 되는 경우, 작가는 이로 인하여 회사에 손해가 발생하지 않도록 신의와 성의를 다하여 회사를 면책시킵니다.
            
            제8조 (계약의 이행 불가 사항 통지의무)
            작가는 소재지, 연락처 등의 중대한 개인 정보 변경으로 서비스 제공이 불가능하거나 그에 상응하는 변경사항이 발생할 경우 3영업일 이내에 회사에게 반드시 통지합니다. 이를 위반할 경우 회사에 발생한 모든 손해에 대하여 작가가 일체의 책임을 집니다.
            
            제9조 (계약의 해제/해지)
            가. 회사와 작가는 이 약관에 명시된 사항을 위반하는 경우 3일 이내에 상대방에게 위반사항에 대해 시정할 것을 요구할 수 있으며, 일방 당사자의 시정요구에도 불구하고 상대방이 위반사항을 시정하지 아니하면 계약을 해지할 수 있습니다.
            나. 회사와 작가는 일방이 다음 각 호의 어느 하나에 해당하는 경우 통지로써 본 계약을 즉시 해지할 수 있습니다.
            1) 본 계약상의 의무사항을 위반하여 상대방이 시정을 요구하여도 상당한 기간 내에 위반사항을 완전히 시정하지 않는 경우
            2) 당사자의 일방이 가압류, 압류, 가처분, 경매 등 강제 집행을 받아 본 계약의 목적을 달성할 수 없는 재정적 문제가 발생하는 경우.
            3) 당사자의 일방이 파산, 화의, 워크아웃 또는 회사정리절차 개시 신청을 한 경우.
            4) 당사자의 일방이 상대방의 신용을 훼손하는 등 양 당사자 간에 본 특약의 목적을 달성할 수 없을 정도로 신뢰 관계가 훼손된 경우.
            5) 기타 관계법령의 제·개정, 정부의 명령, 법원의 판결 등으로 본 특약을 계속 유지하기 어려운 경우.
            
            제10조 (계약의 양도금지)
            회사와 작가는 하도급 행위 등 본 조항에 따른 권리∙의무를 상대방의 사전 서면 동의 없이 타인에게 양도, 증여 및 담보의 목적으로 제공하거나 기타 어떠한 처분 행위의 대상으로 삼을 수 없습니다. 
            
            제11조 (대금정산)
            가. 총판매 대금에서 서비스 이용료, 결제 수수료 및 결제망 이용료와 부가세를 제외한 금액을 작가에게 수익금으로 정산하고, 서비스 이용료의 요율은 내부 정책에 따릅니다.
            나. 구매자가 구매를 확정한 즉시, 1항에 따라 구매자의 결제 대금이 수익금으로 전환됩니다.
            다. 작가는 수익금에 대하여 출금 신청을 할 수 있으며, 회사는 5영업일 이내에 등록된 작가의 계좌로 수익금을 지급합니다. 단, 출금 신청 및 취소 가능 시간은 회사에서 정한 바에 따르며 회사는 서비스 화면 및 기타의 방법을 통해 안내합니다.
            라. 작가가 서비스를 이행하는 과정에서 관계법령 및 본 약관, 서비스 이용약관을 위반하는 등의 문제가 발생한 경우, 회사는 해결 시까지 수익금 지급 및 출금을 보류할 수 있습니다.
            마. 자연재해 또는 금융사의 전산 이슈 발생으로 인한 수익금 입금 지연에 대하여서는 회사가 별도의 책임을 부담하지 않습니다.
            
            제12조 (판매취소)
            가. 작가는 예상치 못한 사유로 정상적인 작업 진행이 곤란한 경우, 지체 없이 구매자에게 거래 취소 사유의 안내 및 환급(에 필요한 조치) 등 관계 법령이 정한 조치를 취하여야 합니다. 나. 아래의 각호에 해당한다고 판단되는 경우, 회사는 작가에게 서비스 이용 제한 등의 조치를 취할 수 있습니다.
            - 1항에 해당하는 안내 및 조치를 취하지 않은 경우
            - 작가의 귀책사유로 인해 다수의 취소 및 반품이 발생하는 경우
            - 작가의 일방적인 취소로 거래 상대방 또는 회사에 피해가 발생하는 경우
            
            제13조 (환불)
            가. 회사는 정당한 사유가 있는 경우, 서비스에 대해 작가의 동의 절차 없이 구매자에게 환불할 수 있습니다. 이 경우 정당한 사유가 있는지는 회사 내부의 객관적 기준에 따라 회사가 판단합니다.
            나. 회사는 정산 완료 이후에 환불이 발생하는 경우 작가에게 환불 금액을 추가로 청구할 수 있습니다.
            
            제14조 (보증 및 면책)
            가. 작가가 관련 법령 및 본 약관, 서비스 이용약관을 위반하거나 서비스 제공 중 민원이 제기되어 계약 진행하기 곤란한 사유가 발생하는 경우, 위반사항이 시정될 때까지 판매 기간이 조정되거나 서비스의 판매가 중지될 수 있습니다.
            나. 회사가 작가로부터 제공받은 정보 또는 제3자의 지적재산권, 개인정보 등 제반 권리 침해를 이유로 분쟁이 발생하거나 발생한 우려가 있는 경우, 작가는 작가의 비용으로 회사를 면책시키고 이와 관련하여 회사에 발생한 손해에 대한 모든 책임을 집니다.
            
            제15조 (서비스 품질보증)
            가. 계약의 체결과 동시에 작가는 계약기간 동안 서비스의 품질을 떨어뜨리는 행위나 회사의 경쟁업체 등에 동일 유사한 서비스의 판매 대행을 위탁하는 행위를 할 수 없습니다. 단, 판매 특성상 서비스 품질이 현저하게 떨어지지 않는 경우나 구매자가 서비스를 이용하는 데에 있어 불편을 초래하지 않는 경우에는 예외로 합니다.
            나. 작가는 신의성실의 원칙에 입각하여 행동하여야 하며, 연락 두절·직접 결제 유도 및 구매자가 정상적인 서비스를 받는 과정상에서 회사 및 구매자의 신뢰와 기대를 배반하여서는 안 됩니다.
            
            제16조 (비밀유지)
            가. 계약 체결의 모든 사항은 기밀이며, 회사와 작가는 본 업무 수행과 관련하여 직접 또는 간접적으로 취득한 일체의 정보(상대방의 기술 및 사업 정보, 회원 정보 및 문서, 전자 파일·문서의 형식을 취하는 기타 그 밖의 정보, 본 약관에서 명시한 당사자들의 권리 의무에 관한 세부사항 등을 포함하나 이에 제한되지 않음)를 상대방의 사전 동의 없이 외부로 유출 및 공개하거나 본 약관의 이행, 서비스의 이용, 구매자와의 거래 진행 등을 위한 목적 이외의 용도로 사용할 수 없습니다.
            나. 회사와 작가는 1항의 정보가 자산 가치를 지니고 있음을 인정하고, 본 약관 및 계약서에서 달리 명시되지 아니하는 한, 기밀 정보 보호를 위해 합리적인 조치를 취해야 합니다.
            다. 본 조항에 따른 의무는 본 약관 및 개별 서비스의 종료 후에도 회사와 작가에 대하여 유효하게 존속됩니다.
            라. 단, 회사는 법원, 수사기관 또는 정부기관의 요청 시 작가의 정보를 제공할 수 있으며, 작가로부터 채무를 변제받기 위하여 채권추심업체에 작가의 정보를 제공할 수 있습니다.
            
            제17조 (권리관계)
            가. 서비스 등 작가가 등록한 게시물에 대한 저작권은 작가에게 있으며, 작가의 게시물을 노출·제공하기 위해 발생한 결과물 등 회사를 통해 창작된 일체의 유ㆍ무형 콘텐츠에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.
            나. 회사는 계약의 이행을 위하여 필요한 범위에 한해 작가의 게시물 등 지적 재산을 활용할 수 있습니다.
            다. 회사와 작가는 계약에서 합의한 용도 이외의 목적으로 상대방의 저작물을 사용할 수 없습니다. 
            
            제18조 (개인정보보호)
            가. 회사와 작가는 상대방으로부터 계약의 이행을 위한 개인정보를 제공받는 경우 개인정보 보호법 등 관련 법령에 따른 제반 절차와 기준을 준수하여야 하며, 이를 제3자에게 제공하거나 합의한 목적 이외의 용도(예 : 광고성 문자, 이메일 발송 등)로 사용할 수 없습니다.
            나. 회사와 작가는 아래의 각호에 해당한다고 판단되는 경우, 정보제공자의 선택에 따라 제공받은 정보를 반환하거나 폐기하여야 하고, 요청받은 경우 서면에 의한 확인서를 제출하여야 합니다.
            - 서비스의 제공이 완료된 경우
            - 계약기간 만료 등의 사유로 본 계약이 종료된 경우
            - 정보제공자가 언제라도 서면 또는 기타의 방법으로 요구하는 경우
            
            제19조 (손해배상)
            가. 회사와 작가 중 어느 일방이 이 약관에서 정한 계약 내용을 위반하여 상대방 또는 구매자 및 제3자에게 손해가 발생한 경우, 원인을 제공한 귀책사유자는 아래의 사례와 같이 모 손해(변호사 보수 등의 방어비용 포함)와 위약벌을 배상할 책임을 집니다.
            - 상대방으로부터의 손해배상 청구 및 제소
            - 상대방의 판매 기회손실 및 이미지 손상 등 상거래 관계 손해배상
            - 구매자 및 제3자로부터의 손해배상 청구 및 제소
            - 수사기관 및 행정기관 등 관공서로부터의 협조 요청 및 행정 조치 등
            나. 상거래 관계의 손해배상은 회사와 작가가 별도 합의할 수 있습니다.
            다. 작가가 회사에 대한 채무가 있는 경우 회사는 작가에게 지급할 대금으로 즉시 상계 조치 할 수 있습니다.
            
            제20조 (위약벌)
            <삭제>
            제20조 (공정거래 준수)
            작가와 회사는 공정하고 투명한 거래를 위하여 다음 각호의 사항을 준수 합니다.
            가. 작가와 회사는 본 계약과 관련하여 상대방의 임직원 및 이해관계자에게 금품, 향응 등 경제상의 이익 또는 편의를 요구하거나 제공하지 아니하며, 공정한 거래질서에 반하는 행위를 하여서는 안 됩니다.
            나. 작가는 회사의 임직원으로부터 부당한 이익의 제공을 요청받았을 경우 이를 거부하고 즉시 회사에 알려야 하며, 회사의 관련 조사에 성실히 응해야 합니다.
            다. 본 조항의 위반 당사자는 모든 민형사상의 법적 책임을 부담하며, 상대방은 계약의 전부 또는 일부를 해제 또는 해지할 수 있습니다.
            
            제21조 (관할법원)
            본 계약에 대한 소송의 관할법원은 한국 내의 “회사”의 주소지 관할 법원으로 합니다.
            
            제22조 (분쟁의 해결)
            이 약관에서 명시되지 않은 사항, 해석상 이견이 있는 경우 관련 법규 및 상관습에 따르기로 하며, 합의가 이루어지지 않을 경우 본 약관의 22조의 내용에 따라 관할 법원을 통하여 분쟁을 해결합니다.


            `,
            certificated: false,
            accountCertificated: false,
            agree: false,
            sign: false,
        }
    }

    handleAgree = evt => {
        var state = this.state;
        state.agree = evt.target.checked;

        this.setState(state);
    }

    handleSign = evt => {
        var state = this.state;
        state.sign = evt.target.checked;

        this.setState(state);
    }

    handleNameChange = (e) => {
        var state = this.state;
        state.name.class = "input";
        state.name.msg = ""
        state.name.clear = true;
        state.name.val = e.target.value;


        this.setState(state)
    }

    handlePhoneChange = (e) => {
        var state = this.state;
        if(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/.test(e.target.value) === false) {
            state.phone.class = "input error";
            state.phone.msg = "휴대폰 번호를 입력해주세요."
            state.phone.clear = false;
        } else {
            state.phone.class = "input";
            state.phone.msg = ""
            state.phone.clear = true;
        }

        state.phone.val = e.target.value;

        this.setState(state)
    }

    handleBankChange = (e) => {
        var state = this.state;
        state.bank.val = e;
        state.bank.clear = true;
        state.bank.msg = ""
        this.setState(state);
    }

    handleAccountChange = (e) => {
        var state = this.state;

        if(/^[0-9]*$/.test(e.target.value) === true || e.target.value === "") {
            state.account.msg = ""
            state.account.clear = true;
            state.account.class = "input";
        } else {
            state.account.class = "input error";
            state.account.msg = "숫자만 입력해주세요"
            state.account.clear = false;
        }

        state.account.val = e.target.value;

        this.setState(state)
    }

    onCertificationClick = (e) => {
        var state = this.state;
        e.preventDefault();

        if(state.name.val === '' || /^[가-힣]*$/.test(state.name.val) === false) {
            state.name.class = "input error";
            state.name.msg = "이름을 올바르게 입력해주세요."
            this.setState(state)
            alert("이름을 올바르게 입력해주세요")
            return;
        }

        if(state.phone.msg !== "" || state.phone.val === "") {
            state.phone.class = "input error";
            state.phone.msg = "휴대폰 번호를 입력해주세요."
            this.setState(state)
            alert("휴대폰 번호를 올바르게 입력해주세요")
            return;
        }

        var state = this.state;

        const { IMP } = window;

        IMP.certification({
            name: state.name.val,
            phone: state.phone.val,
        },
            (rsp) => {
                console.log(rsp)
                if(rsp.success) {
                    state.certificated = true;
                    this.setState(state)

                    alert("인증이 완료되었습니다.")
                }
                else {
                    if(rsp.error_code === '9014') {
                        alert(`인증이 실패하였습니다. [${rsp.error_code}]`)
                    } else {
                        alert("인증이 실패하였습니다.")
                    }
                }
        });
    }

    handleSubmit = async() => {
        var state = this.state;
        if(state.certificated === false) {
            alert("본인 인증을 완료해주세요.")
            return;
        }

        if(!state.bank.val) {
            state.bank.class = "input error";
            state.bank.msg = "은행을 선택해주세요."
            this.setState(state)
            alert("은행을 선택해주세요.")
            return;
        }

        if(state.account.val === "") {
            state.account.class = "input error";
            state.account.msg = "계좌 번호를 입력해주세요."
            this.setState(state)
            alert("계좌 번호를 입력해주세요.")
            return;
        }

        if(state.agree === false) {
            alert("약관에 동의해주세요")
            return;
        }

        if(state.sign === false) {
            alert("약관에 동의해주세요")
            return;
        }
        var params = {
            name: state.name.val,
            bank: state.bank.val.value,
            account: state.account.val,
            tel: state.phone.val,
            tax_agreement: true,
            promotion_agency_agreement: true,
        }
        const res = await API.sendPost(URL.api.author.create, params)
        if(res.status === 201) {
            var token = res.data.token;
            if( token ) {
                Cookies.remove('RINGU_JWT');
                Cookies.remove('RINGU_JWT', { path: '/'});
                Cookies.remove('RINGU_JWT', { path: '/detail' });
                Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'});
            }

            alert("인증이 완료되었습니다.")
            window.location.href = URL.service.author + User.getInfo().id
        }
    }

    async componentDidMount() {
        try {
            const res = await API.sendGet(URL.api.bank.get)
            console.log(res)
            if(res.status === 200){
                this.bankOptions = res.data.bank
                this.setState(this.state)
            }
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        const selectStyles = {
            control: (styles, {}) => ({
                ...styles,
                "&:hover": {
                    borderColor: 'var(--color-1)',
                },
                "&:focus": {
                    borderColor: 'var(--color-1)',
                    boxShadow: 0,
                },
                height: '60px',
                boxShadow: 0,
                borderWidth: '2px',
            }),
            container: (styles, {}) => ({
                ...styles,
            }),
            valueContainer: (styles, {  }) => ({
                ...styles,
                fontSize: '16px',
                height: '100%',
                padding: '10px 20px',
                fontWeight: '500',
            }),
        }

        var state = this.state

        return (
            this.user.type === 0 &&
            <div id="register-author" className="page3">
                <div className="title-wrap">
                    <h2 className="title">본인 인증</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="row">
                        <div className="input-box">
                            <h3 className="header"> 이름 </h3>
                            <div className="form-group">
                                <input type="text" className={state.name.class} disabled={state.certificated} onChange={this.handleNameChange} value={state.name.val}/>
                                {
                                    !!state.name.msg &&
                                    <div className="info info-error">
                                        <span>{state.name.msg}</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="input-box">
                            <h3 className="header"> 휴대폰 번호 </h3>
                            <div className="form-group">
                                <input type="number" className={state.phone.class} placeholder={"예) 01012345678"} disabled={state.certificated} onChange={this.handlePhoneChange} value={state.phone.val}/>
                                {
                                    !!state.phone.msg &&
                                    <div className="info info-error">
                                        <span>{state.phone.msg}</span>
                                    </div>
                                }
                            </div>
                            <button className="btn btn-auth" disabled={state.certificated} onClick={this.onCertificationClick}>
                                {(state.certificated) ? "인증 완료"  : "본인 인증"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="title-wrap">
                    <h2 className="title">계좌 정보</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="row">
                        <div className="input-box">
                            <h3 className="header"> 은행명 </h3>
                            <div className="form-group">
                                <Select
                                    value={state.bank.val}
                                    options={this.bankOptions}
                                    onChange={this.handleBankChange}
                                    isSearchable={false}
                                    placeholder={""}
                                    styles={selectStyles}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary: 'var(--color-1)',
                                        }
                                    })}
                                    maxMenuHeight="150px"/>
                                {
                                    state.bank.msg &&
                                    <div className="info info-error">
                                        <span>{state.bank.msg}</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="input-box">
                            <h3 className="header"> 계좌번호 </h3>
                            <div className="form-group">
                                <input type="number" placeholder={"-빼고 입력해주세요"} className={state.account.class} onChange={this.handleAccountChange} value={state.account.val}/>
                                {
                                    state.account.msg &&
                                    <div className="info info-error">
                                        <span>{state.account.msg}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>

                <div className="title-wrap">
                    <h2 className="title">약관 동의 및 서명</h2>
                </div>

                <hr/>
                <div className="content">

                    <div className="input-box">
                        <h3 className="header"> 서비스 판매시 '세금' 관련 유의사항 </h3>
                        <div>
                            <textarea rows={15} value={state.tax_term} style={{"overflow":"auto"}} disabled/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> Ringu 판매홍보 대행 약관 </h3>
                        <div>
                            <textarea rows={15} value={state.promotion_term} disabled/>
                        </div>
                    </div>

                    <div className="term-box">
                        <span className="term">
                            본인은 위 약관의 내용을 모두 확인하였으며, Ringu 전문가로서 약관에 따라 성실히 활동할 것에 동의합니다.
                        </span>
                        <span className="check">
                            <label htmlFor="agree-tax" className="cb-container" >
                                <input type="checkbox" id="agree-tax" onClick={this.handleAgree} checked={state.agree}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    동의함
                                </div>
                            </label>
                        </span>
                    </div>

                    <div className="term-box">
                        <span className="term">
                            본인은 본 약관에 서명을 등록함으로써 종이 문서의 서명과 동일한 효력을 갖는데 동의합니다.
                        </span>
                        <span className="check">
                            <label htmlFor="agree-promotion" className="cb-container" >
                                <input type="checkbox" id="agree-promotion" onClick={this.handleSign} checked={state.sign}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    동의함
                                </div>
                            </label>
                        </span>
                    </div>

                </div>

                <div className="btn-wrap">
                    <button className="btn btn-color-2" onClick={this.handleSubmit}>
                        완료
                    </button>
                </div>
            </div>
        )
    }
}

export default RegisterAuthorDetail;
