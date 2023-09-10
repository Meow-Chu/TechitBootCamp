class VendingMachineFunc {
  // section 1 요소 선택 (1)
  constructor() {
    const vMachine = document.querySelector(".section1");
    this.balance = vMachine.querySelector(".bg-box p");
    this.itemList = vMachine.querySelector(".cola-list");
    this.inputCostEl = vMachine.querySelector("#input-money");
    this.btnPut = vMachine.querySelector("#input-money+.btn"); //(2)
    this.btnReturn = vMachine.querySelector(".bg-box+.btn"); //(3)
    this.btnGet = vMachine.querySelector(".btn-get");
    this.stagedList = vMachine.querySelector(".get-list");

    // section 2 요소 선택
    const myInfo = document.querySelector(".section2");
    this.myMoney = myInfo.querySelector(".bg-box p"); //(4)

    // section3 요소 선택
    const getInfo = document.querySelector(".section3");
    this.getList = getInfo.querySelector(".get-list");
    this.txtTotal = getInfo.querySelector(".total-price");
  }

  setup() {
    //(5)
    this.bindEvents();
  }

  //장바구니 목록 생성 함수
  stagedItemGenerator(target) {
    const stagedItem = document.createElement("li");
    stagedItem.dataset.item = target.dataset.item; //(6)
    stagedItem.dataset.img = target.dataset.img;
    stagedItem.dataset.price = target.dataset.price;
    stagedItem.innerHTML = `    
          <img src="./img/${target.dataset.img}" alt="">   
          ${target.dataset.item}
          <strong>
            1
            <span class="a11y-hidden">개</span>
          </strong>

    `; //(7)
    this.stagedList.append(stagedItem);
  }

  //벤딩머신에 일어나는 모든 이벤트 기능 구현
  bindEvents() {
    /**
     * 1.입금버튼기능
     * 소지금 === 소지금 - 입금액
     * 잔액 === 기존의 잔액 + 입금액
     * 입금액이 소지금보다 많으면 "소지금이 부족합니다." alert창을 띄웁니다
     * 입금액 Input창은 초기화 되어야함
     */

    this.btnPut.addEventListener("click", () => {
      const inputCost = parseInt(this.inputCostEl.value); //(8) (9)
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(",", ""));
      const balanceVal = parseInt(this.balance.textContent.replaceAll(",", ""));
      if (inputCost && inputCost > 0) {
        if (inputCost <= myMoneyVal) {
          //this를 쓰는 이유는 다른 기능을 통해서 myMoney의 textContent의 값이 언제 바뀔지 모르기 때문이다
          this.myMoney.textContent =
            new Intl.NumberFormat().format(myMoneyVal - inputCost) + " 원"; //(10)

          this.balance.textContent =
            new Intl.NumberFormat().format(
              (balanceVal ? balanceVal : 0) + inputCost
            ) + " 원";
        } else {
          alert("소지금이 부족합니다.");
        }
        this.inputCostEl.value = null;
      }
    });

    /**
     * 2. 거스름돈 반환 기능만들기
     * 반환 버튼을 누르면 소지금 === 소지금 + 잔액
     * 잔액창은 초기화 됩니다.
     */

    this.btnReturn.addEventListener("click", () => {
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(",", ""));
      const balanceVal = parseInt(this.balance.textContent.replaceAll(",", ""));
      if (balanceVal) {
        this.myMoney.textContent =
          new Intl.NumberFormat().format(myMoneyVal + balanceVal) + "원";

        this.balance.textContent = null;
      }
    });

    /**
     * 3. 자판기 메뉴 기능
     * 콜라를 누르면 잔액 === 잔액 - 콜라 가격
     * 콜라가격보다 잔액이 적다면 "잔액이 부족합니다." 경고창 출력
     * 콜라가 장바구니에 등록 되어야합니다
     * 콜라의 data-count 값을 -1 합니다
     * 만약 콜라의 data-count 값이 0이라면 button 요소에 disabled 속성이 추가되고, 콜라 템플릿에 strong 태그가 추가되어야 합니다.
     */

    const colaBtns = this.itemList.querySelectorAll("button");
    //btnCola가 list여서 바로 붙일 수 없고 forEach문으로 순회해야됨 //(11)
    colaBtns.forEach((colaBtn) => {
      colaBtn.addEventListener("click", (event) => {
        const balanceVal = parseInt(
          this.balance.textContent.replaceAll(",", "")
        );
        const targetElPrice = parseInt(colaBtn.dataset.price); //(12)
        const stagedListItem = this.stagedList.querySelectorAll("li"); //(13)
        let isStaged = false; //콜라가 장바구니에 없으면 false, 담겨있으면 true라서 반복문에 의해 재생성될 일이 없게 만들기 위한 설정

        if (balanceVal >= targetElPrice) {
          this.balance.textContent =
            new Intl.NumberFormat().format(balanceVal - targetElPrice) + "원";

          //forEach 문은 break를 넣든, return을 해도 신경안쓰고 모든 요소를 순회를 한다는게 비효율적이다. 장바구니에 들어있는 콜라 중에 내가 클릭한 콜라가 들어있는가를 확인만 하면 되기에 for of 사용
          for (const item of stagedListItem) {
            // 선택한 콜라가 이미 장바구니에 존재하는 경우, 아이템이 생성되는게 아니라 음료갯수가 추가되어야한다.
            if (item.dataset.item === colaBtn.dataset.item) {
              const itemTxt = item.querySelector("strong");
              itemTxt.firstChild.textContent =
                parseInt(itemTxt.firstChild.textContent) + 1;
              isStaged = true;
              break;
            }
          }

          // (14) 만약 처음 선택한 콜라라면 stagedItemGenerator메서드로 콜라를 장바구니에 담기
          if (!isStaged) {
            this.stagedItemGenerator(colaBtn);
          }

          colaBtn.dataset.count--;

          if (parseInt(colaBtn.dataset.count) === 0) {
            colaBtn.disabled = true; //(15)
            colaBtn.insertAdjacentHTML(
              //(16)
              "afterbegin",
              '<strong class="soldout">품절</strong>'
            );
          }
        } else {
          alert("잔액이 부족합니다. 돈을 더 입금해주세요");
        }
      });
    });

    /**
     * 4. 획득 버튼 기능
     * 획득 버튼을 누르면 선택한 음료수 목록이 음료 목록으로 이동합니다.
     * 획득한 음료의 금액을 모두 합하여 총 금액을 업데이트 합니다.
     */
    this.btnGet.addEventListener("click", () => {
      const itemStagedList = this.stagedList.querySelectorAll("li");
      const itemGetList = this.getList.querySelectorAll("li");
      let totalPrice = 0;

      // 장바구니에 있는 획득한 음료에 정보가 없어서 먼저 옮기는 것부터 하기로 함.
      // this.getList.append(...itemStagedList);

      for (const itemStaged of itemStagedList) {
        // 장바구니에 있는게 획득한음료에 있는지부터 먼저 확인하기 위해서.... 장바구니에 있는 걸 모두 다 꺼내고 난 뒤 다음 단계 들어갈 거임
        let isStaged = false;

        for (const itemGet of itemGetList) {
          if (itemStaged.dataset.item === itemGet.dataset.item) {
            const itemTxt = itemGet.querySelector("strong");
            itemTxt.firstChild.textContent =
              parseInt(itemTxt.firstChild.textContent) +
              parseInt(
                itemStaged.querySelector("strong").firstChild.textContent
              );

            isStaged = true;
            break; //(17)
          }
        }
        if (!isStaged) {
          this.getList.append(itemStaged); //(18)
        }
      }
      this.stagedList.innerHTML = null;

      //모든 목록을 합하기
      this.getList.querySelectorAll("li").forEach((itemGet) => {
        totalPrice += //(19)
          parseInt(itemGet.dataset.price) *
          parseInt(itemGet.querySelector("strong").firstChild.textContent);
      });

      this.txtTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(
        totalPrice
      )}원`;
    });
  }
}

export default VendingMachineFunc;

/**
 * (1) 필요한 UI를 모두 가져오는, 일명 초기화작업이 이루어짐. this를 붙이는 것은 클래스의 인스턴스 프로퍼티로 저장되어 클래스 외부에서 접근 가능한 데이터를 가리키는 데 사용하기 위해서이다. vMachine, getInfo, myInfo는 클래스 내부에서만 사용되고, 클래스 외부에서는 사용하지 않으므로 지역 변수로 간주되고, this를 붙이지 않아도 됨.
 * (2) id가 input-money인 요소의 다음 형제 요소 중에서 class가 btn인 요소 : <button type="button" class="btn">입금</button>
 * (3) class가 bg-box인 요소의 다음 형제 요소 중에 class가 btn인요소 :  <button type="button" class="btn">거스름돈 반환</button>
 * (4) class가 bg-box인 요소의 자식 요소중 P태그를 선택 :  <p>25,000원</p>
 * (5) setup() 메서드가 this.bindEvents();만 호출하고 그외 로직을 포함하지 않는다면, setup() 메서드는 사실상 있으나마나이다. index.js에서 setup() 대신 bindEvents()로 바꾸어도 정상동작한다. 그러나 코드의 가독성과 유지보수성을 향상시키기위해 setup()메서드를 관례적으로 사용하는 편이다. 코드를 읽을 때 setup() 메서드를 통해 초기화 및 설정 단계를 파악할 수 있으므로 코드의 구조가 더 명확해지고 나중에 코드를 수정하거나 확장할 때 초기화 로직을 setup() 메서드 내부로 추가하는 것이 더 용이할 수 있다.
 * (6) 요소에 데이터를 저장하도록 도와주는 data 속성으로 HTML 요소에 추가적인 정보를 저장하여 마치 프로그램 가능한 객체처럼 사용할 수 있게 합니다. 단,  data 속성의 이름에는 콜론(:) 이나 영문 대문자가 들어가서는 안됩니다.
 * (7) colaGenerator.js → colaFactory(data) 메소드 → itemTemplate 변수에 템플릿 리터럴로 data-* 속성으로 요소에 데이터를 저장해두었다. 이 값들을 고대로 추출하는 것임
 * (8) <input> 태그에서 사용자의 입력 값을 가져오려면 value 속성을 사용하면 된다.  <p>태그의 입력값(내용)을 가져오려면 textContent를 사용하면 된다
 * (9) value속성과 textContent를 통해 가져온 입력값은 문자열의 형태이므로 +,- 등의 연산을 하려면 parseInt 함수를 사용해 문자열을 정수로 변환시켜준다.
 * (10) new Intl.NumberFormat()은  숫자를 현지화된 형식으로 표시하는 데 사용. 사용자의 브라우저 설정을 기반으로 자동으로 형식이 결정되는데, locales 옵션으로 변경도 가능하다
 *     format() 메서드는  숫자를 표시하는 방식을 지정한 locales에 따라 조정한다. (그룹화 기호 ex.1,000 표시 / 소수점 위치 및 기호 / 통화 표시 / 소수 자릿수)
 * (11) querySelectorAll로 선택된 NodeList(노드 목록)이므로, 배열과 유사한 객체이지만 배열은 아니다. forEach 메서드는 배열에 대해서만 사용 가능한데, 여기서 사용하는 이유
 * (12) DOM 요소의 dataset 속성은 HTML 요소의 사용자 지정 데이터 속성(attribute)에 액세스하기 위한 방법이다. 예를 들어, <button data-price="100">콜라</button>와 같이 HTML 요소에 data-price 속성을 설정했다면, JavaScript에서 이 값을 가져오려면 dataset.price를 사용해야 한다.
 * (13) 주석 처리된 HTML 코드는 브라우저에 의해 렌더링되지 않지만 웹 페이지의 DOM 트리에는 그대로 포함되어 있으며 JavaScript는 DOM 트리 상의 요소에 접근할 수 있다
 * (14) !isStaged = true인데, 그렇다면 장바구니에 콜라가 담겼다는 논리 아니야? 라며 혼란에 빠졌는데 그게 아님! if 조건문문의 단순한 공식을 이용한 것이었음. "아, 논리NOT연산자인 !를 붙였다고 true값이 나와? 그렇다면 너의 isStaged 값이 false였구나~ 장바구니에 담겨있는 콜라가 item으로 들어 온 것이 아니었구나! 콜라를 장바구니에 담아주는 li를 생성해야겠구나~~~ "
 * (15) <button> 요소의 disabled 속성은 boolean 값을 나타낸다. 버튼 요소가 활성화되었는지 또는 비활성화되었는지를 true 또는 false로 표현
 * (16) element.insertAdjacentHTML(position, text);
 * (17) for (const itemGet of itemGetList) 루프를 종료시키고 if (!isStaged) 블록이 실행되지 않는다. 바로 다음 음료를 검사하는 단계로 넘어간다.
 * (18)  itemStagedList가 section1의 <ul> 요소이고, 이 <ul> 하위요소인 <li> itemStaged는 배열 또는 iterable 객체로 간주됨. 따라서 for...of 구문을 사용하여 itemStagedList를 반복(iterate)하면 <li> 요소들을 차례대로 접근할 수 있다. 또한 애초에 HTML에서도 동일한 클래스명(.get-list)를 사용했고 css에서도 동일한 스타일을 적용해 두었음.
 * (19) 값을 누적(더하기)합니다. 이 변수는 이전까지 계산된 총 가격을 저장함
 */
