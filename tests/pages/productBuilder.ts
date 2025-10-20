export class Scenario {
  private basicPrice: string = "";
  private discountPrice: string = "";


  hasbasicPrice(basicPrice: string ): this {
    this.basicPrice = basicPrice.replace(/\$/g, '').trim()
  return this;
}

  hasDiscountPrice(discountPrice: string | number): this {
    if (discountPrice != "no discount" && typeof discountPrice === "string") {
      this.discountPrice = discountPrice.replace(/\$/g, '').trim()
    }
    else {
       this.discountPrice ="0"
    }
    return this;
  }
  
  calculate() {
    return [this.basicPrice, this.discountPrice].map(elem => Number(elem))
  }
}

