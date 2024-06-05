// 检查两个 rect 是否有重合
export function isTwoRectOverlap(rect1: any, rect2: any) {
    return !(
      rect1.left > rect2.left + rect2.width ||
      rect1.left + rect1.width < rect2.left ||
      rect1.top > rect2.top + rect2.height ||
      rect1.top + rect1.height < rect2.top
    );
  }
  
  export function checkOverlap(rectList: any) {
    if (rectList.length < 2) return false;
  
    return rectList.some((rect1: any, index: any) => {
      return rectList
        .slice(index + 1)
        .some((rect2: any) =>
          isTwoRectOverlap(rect1.getBoundingRect(), rect2.getBoundingRect())
        );
    });
  }