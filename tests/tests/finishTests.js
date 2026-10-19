/* Tests for the Third-Party Modified Version of the webMUSHRA Software.
 * Added 2026-10-19. Subject to LICENSE.txt in the repository root.
 */

(function() {
  var originalPopup;
  var popupCalls;
  var pages;

  function createPage(showErrors, responses, participant) {
    var config = {
      name: "Finish",
      content: "",
      popupContent: "Results sent",
      questionnaire: [{ type: "text", name: "answer", label: "Answer" }]
    };
    if (showErrors !== undefined) config.showErrors = showErrors;
    var calls = [];
    var sender = { send: function(session) {
      calls.push(JSON.parse(JSON.stringify(session)));
      return responses.shift();
    } };
    var localizer = { getFragment: function(language, key) { return key; } };
    var page = new FinishPage(
      { getLocalizer: function() { return localizer; } },
      { participant: participant || { name: [], response: [] }, trials: [] },
      sender, config, "en"
    );
    $("#qunit-fixture").html("<div id='finish-content'></div><div id='popupDialog'><h1 id='popHeader'></h1><div id='popupResultsContent'></div></div>");
    page.render($("#finish-content"));
    $("#answer").val("original answer");
    // Form-validation polling is tested separately; make this fixture clickable immediately.
    $("#send_results").removeAttr("disabled");
    pages.push(page);
    return { page: page, calls: calls };
  }

  QUnit.module("Finish page submission", {
    setup: function() {
      originalPopup = $.fn.popup;
      popupCalls = [];
      pages = [];
      $.fn.popup = function(action) { popupCalls.push(action); return this; };
    },
    teardown: function() {
      $.fn.popup = originalPopup;
      pages.forEach(function(page) { clearInterval(page.interval); });
    }
  });

  [undefined, false, true].forEach(function(showErrors) {
    QUnit.test("send error is visible without completion; showErrors=" + showErrors, function(assert) {
      var fixture = createPage(showErrors, [true]);
      $("#send_results").trigger("click");
      assert.equal(fixture.calls.length, 1, "One explicit click sends once");
      assert.deepEqual(popupCalls, [], "No success popup");
      assert.ok($.contains($("#finish-content")[0], fixture.page.errorDiv[0]), "Error remains on the finish page");
      assert.ok(fixture.page.errorDiv.text().length > 0, "Submission error is explained");
      assert.equal(fixture.page.errorDiv.attr("role"), "alert", "Error can be announced");
      assert.equal($("#answer").val(), "original answer", "Entered answer remains available");
    });
  });

  QUnit.test("successful submission retains the completion popup", function(assert) {
    var fixture = createPage(undefined, [false]);
    $("#send_results").trigger("click");
    assert.equal(fixture.calls.length, 1);
    assert.deepEqual(popupCalls, ["open"]);
    assert.equal(fixture.page.errorDiv.text(), "");
    assert.deepEqual(fixture.calls[0].participant, { name: ["answer"], response: ["original answer"] });
  });

  QUnit.test("explicit resubmission updates answers without duplicating existing fields", function(assert) {
    var fixture = createPage(false, [true, false], { name: ["earlier"], response: ["retained"] });
    $("#send_results").trigger("click");
    $("#answer").val("revised answer");
    $("#send_results").trigger("click");
    assert.equal(fixture.calls.length, 2, "Only two user-triggered attempts");
    assert.deepEqual(fixture.calls[0].participant, { name: ["earlier", "answer"], response: ["retained", "original answer"] });
    assert.deepEqual(fixture.calls[1].participant, { name: ["earlier", "answer"], response: ["retained", "revised answer"] });
    assert.equal(fixture.page.errorDiv.text(), "", "Old error is cleared after confirmed sender success");
    assert.deepEqual(popupCalls, ["open"], "Only the successful attempt opens completion");
  });

  QUnit.test("radio answers retain their field position on resubmission", function(assert) {
    var fixture = createPage(false, [true, true]);
    $("#answer").val("");
    $("#finish-content").append("<input type='radio' name='answer__response' value='one' checked><input type='radio' name='answer__response' value='two'>");
    $("#send_results").trigger("click");
    $("input[value='two']").prop("checked", true);
    $("#send_results").trigger("click");
    assert.deepEqual(fixture.calls[0].participant, { name: ["answer"], response: ["one"] });
    assert.deepEqual(fixture.calls[1].participant, { name: ["answer"], response: ["two"] });
    assert.deepEqual(popupCalls, []);
  });

  QUnit.test("required-field validation continues after a send error", function(assert) {
    var done = assert.async();
    var fixture = createPage(false, [true]);
    fixture.page.load();
    $("#send_results").trigger("click");
    $("#answer").val("");
    setTimeout(function() {
      assert.ok($("#send_results").prop("disabled"), "Clearing a required answer disables submission");
      assert.equal(fixture.calls.length, 1, "Validation does not resend");
      done();
    }, 120);
  });
})();
