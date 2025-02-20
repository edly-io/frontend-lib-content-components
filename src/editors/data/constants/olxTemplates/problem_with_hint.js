/* eslint-disable */
// ---
// metadata:
//     display_name: Problem with Adaptive Hint
//     markdown: !!null
// data: |
export const problemWithHint = `<problem>
    <text>
        <p><h4>Problem With Adaptive Hint</h4></p>
        <p>This problem demonstrates a question with hints, based on using the <tt class="tt">hintfn</tt> method. </p>

        <customresponse cfn="test_str" expect="python">
            <script type="text/python" system_path="python_lib">
                def test_str(expect, ans):
                print(expect, ans)
                ans = ans.strip("'")
                ans = ans.strip('"')
                return expect == ans.lower()

                def hint_fn(answer_ids, student_answers, new_cmap, old_cmap):
                aid = answer_ids[0]
                ans = str(student_answers[aid]).lower()
                print('hint_fn called, ans=', ans)
                hint = ''
                if 'java' in ans:
                hint = 'that is only good for drinking'
                elif 'perl' in ans:
                hint = 'not that rich'
                elif 'pascal' in ans:
                hint = 'that is a beatnick language'
                elif 'fortran' in ans:
                hint = 'those were the good days'
                elif 'clu' in ans:
                hint = 'you must be invariant'
                if hint:
                hint = "&lt;font color='blue'&gt;Hint: {0}&lt;/font&gt;".format(hint)
                new_cmap.set_hint_and_mode(aid,hint,'always')
            </script>
            <label>What is the best programming language that exists today? You may enter your answer in upper or lower case, with or without quotes.</label>
            <textline correct_answer="python"/>
            <hintgroup hintfn="hint_fn"/>
        </customresponse>
    </text>
</problem>`;

export default { problemWithHint };
