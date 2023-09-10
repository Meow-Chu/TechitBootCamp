// 클래스 ColaGenerator를 사용하여 콜라 상품 목록을 웹 페이지에 동적으로 생성하는 기능 구현

class ColaGenerator {
  constructor() {
    this.itemList = document.querySelector(".cola-list");
  }

  // 콜라 객체를 초기화합니다. (1)
  async setup() {
    const response = await this.loadData(); //(2)
    this.colaFactory(response);
  }

  //.cola-list에 사용될 데이터(items.json)를 로드합니다
  async loadData() {
    try {
      const response = await fetch("./items.json");

      if (!response.ok) {
        throw new Error("HTTP에러!!!" + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error("콜라데이터를 로딩하는 중에 문제가 발생했습니다", error);
    }
  }

  // 콜라의 템플릿 코드입니다.(3)
  colaFactory(data) {
    const docFrag = new DocumentFragment(); //(4)
    data.forEach((el) => {
      //(5)
      const item = document.createElement("li"); // (6)
      const itemTemplate = `
      <button type="button" class="btn-cola" data-item="${el.name}" data-count="${el.count}" data-price="${el.cost}" data-img="${el.img}">
      <img src="./img/${el.img}" alt="${el.name}"/>   
      <span class="cola-name">${el.name}</span>
      <strong class="cola-price">${el.cost}원</strong>
      </button>
      `;
      item.innerHTML = itemTemplate;
      docFrag.append(item); //(8)
    });
    this.itemList.append(docFrag); //(9)
  }
}

// (7)
export default ColaGenerator;

/**
 * (1) setup() 모든걸 초기화하는 함수, this가 가리키는 것은 인스턴스인데 setup함수가 선언되기 전에 호출되어있다. 이는 호이스팅현상 (함수선언, var변수선언에서 발생함)
 * (2) loadData에 async가 붙어있으므로 기다려줘야한다. await 붙여주는거 잊지말자
 * (3) 매개변수(파라미터)인 data에는 javascript 객체인 items.json이 들어감
 * (4) DocumentFragment는  DOM 요소를 메모리에 올려두고 한 번에 DOM에 추가하는 데 사용되는 가벼운 문서 조각입니다. 메서드는 활성화된 문서 트리 구조의 일부가 아니기 때문에 내부의 트리를 변경해도 문서나 성능에 아무 영향도 주지 않으며 리플로우도 방지할 수 있다. DocumentFragment를 사용하지 않는다면 각 itemTemplate가 생성될 때마다 DOM에 직접 추가되고, DOM요소가 추가될 때마다 브라우저는 해당 요소를 화면에 렌더링해야되므로 리플로우가 발생하는 것이다. 
 * (5) 전달받은 data 가공하기  !  현재 data는 배열형식이므로 원하는 데이터를 뽑아서 템플릿화하기위해 forEach문 사용하자
 * (6) data속성을 버튼요소에 추가한 이유는 선택한 콜라가 장바구니에 들어갈 때. 누른 콜라의 정보(이름,가격 등)을 뽑아내는 작업을 수월하게하기위함. data속성을 이용하는 것 대신 클릭할 때 각 정보의 class를 이용해서 각 data를 뽑을 수도 있는데, 이러면 돔API를 또 사용해야하기 때문에 번거롭다
 * (7) 자바스크립트모듈문법인 export, import (다른 js파일에서도 공유할 수 있음)
'수출한다 딱하나만'의미로 하나만 뺄거면 export default 사용.
여러개라면, export class ColaGenerator; 마지막에 function item1(); function item2();
 * (8-9)Document Fragment는 여러 개의 DOM 요소를 담는 데 사용되는 일종의 컨테이너로. DocumentFragment에 요소를 추가하면 실제 DOM에 추가되기 전에 메모리에서만 관리되다가 한 번에 추가됩니다. 여기에선 item을 생성한 후, docFrag에 append 메서드를 사용하여 item을 추가합니다. 그리고 마지막으로 docFrag 전체를 this.itemList에 추가합니다.
*/
