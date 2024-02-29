import { Component } from '@angular/core';
import { giga } from 'gigachat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-personal-feature';
  transactionData = undefined
  htmlResponse:any = ''
  constructor() {
    giga.platform.init().then(() => giga.platform.initSession())

    giga.ai.gigaChat.open()

    this.getTransactionData().then(res => {
      this.transactionData = res
    })
  }

  async getTransactionData() {
    try {
      const accountList = await giga.api.privateClient.pbsa.accounts.list();
      const transactions = await giga.api.privateClient.pbsa.transactions.get({
        accountId: accountList.result.PrivateBankAccounts[0].AccountNumberForRequests,
        dateFrom: '08/10/2022',
        dateTo: '08/11/2022'
      });
      return transactions.result;
    } catch (error) {
      console.error(error);
    }
  }


  executeAiMessage(){
    const prompt = 'Analyse the following transactions for a month and explain what i am spending most of my money on and provide any recommendations on what i can do to better manage my finances. \n' +
      ' transaction data:\n' +
      ' \n' + JSON.stringify(this.transactionData) +
      ' Return the ENTIRE response in HTML ONLY'

    giga.ai.message.add(prompt).then(res => {
      console.log(res)
      this.htmlResponse = res;
    })
  }

}


