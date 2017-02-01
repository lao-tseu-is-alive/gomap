/**
 * Created by cgil on 2/1/17.
 */
const Form = `
<p>
<div class="row">
<form>
        <div class="six columns">
              <label for="EmailInput">Votre email</label>
              <input class="u-full-width" type="email" placeholder="test@mailbox.com" id="EmailInput">
        </div>
        <div class="six columns">
              <label for="exampleRecipientInput">Raison du contact</label>
              <select class="u-full-width" id="exampleRecipientInput">
                <option value="Option 1">Questions</option>
                <option value="Option 2">Signaler un Bug</option>
                <option value="Option 3">Demande de collaboration</option>
              </select>
        </div>
        <label for="exampleMessage">Message</label>
        <textarea class="u-full-width" placeholder="Hi Dave …" id="exampleMessage"></textarea>
        <label class="example-send-yourself-copy">
            <input type="checkbox">
            <span class="label-body">Send a copy to yourself</span>
        </label>
        <input class="button-primary" type="submit" value="Submit">
</form>
</div>
</p>
`; //end of Form content template

export default Form;
