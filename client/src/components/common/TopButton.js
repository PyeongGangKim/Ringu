import '../../scss/common/topButton.scss'

const TopButton = () => {
    function moveTop(){
        document.documentElement.scrollTop = 0;
    }
    return (
        <button className = "top-button" onClick = {() => { moveTop()}} > 
            <div className = "top-button-img"/> 
            <div className = "top-button-word"> top </div>
        </button>
    );
}

export default TopButton;