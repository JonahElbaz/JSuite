const reportTemplateHTML = `
<html lang="en">
<head>
    <title></title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * {
            font-family: "Montserrat";
            color: #46466b;
        }

        strong {
            color: #4E57F9;
        }
        
        .bod {
            max-width: 600px; margin: auto; width: 600px;padding-top: 40px; margin-bottom: 20px;
        }

        .logo {
            background: #4E57F9;
            font-weight: 600;
            margin: auto;
            font-size: 50px;
            width: 70px;
            height: 70px;
            text-align: center;
            border-radius: 40px;
            line-height: 71px;
            color: white;
            box-shadow: 2px 2px 7px 0px black;
        }

        .data-text {
            color: #909faf;
            font-weight: bold;
        }

        .colored {
            color: #4E57F9;
        }
        
        .report-title {
            text-align: center;color: #4E57F9; font-weight: bold;
        }
        
        .book-title {
            text-align: center; margin-top: 6px; font-size: 10px; font-weight: bold;
        }
        .range {
            text-align: center; margin-top: 6px; font-size: 10px;
        }
        
        .data-text-div {
            width: 100%; margin-top: 40px;
        }
        
        .frequency-div {
            margin-top: 20px; line-height: 24px;
        }
        
        .earned-table {
            width: 100%; margin-top: 60px;
        }
        
        .margin-top-20 {
            margin-top: 20px;
        }
        
        .company-bdown {
            color: #4E57F9; font-weight: bold;line-height: 40px;
        }
        
        .company-table {
            width: 100%; background-color: #f6f9fc; padding: 6px 14px 6px 14px;
        }
        
        .company-theader {
            font-weight: bold; height: 40px;border-bottom: thin solid #46466b;
        }
        
        .comapny-breakdown {
            height: 30px;
        }
    </style>
</head>
<body>
<div class="bod">
    <div class="logo">J</div>

    <div style="padding: 40px 12px;background-color: white;">
        <div class="report-title">{{reportType}} Report</div>
        <div class="book-title">{{bookTitle}}</div>
        <div class="range">{{dateRange}}</div>
        <div>

            <table class="data-text-div">
                <tr>
                    <td class="data-text">Amount Worked</td>
                    <td class="data-text">Amount Billed</td>
                </tr>
                <tr>
                    <td class="data-text colored">{{amountWorked}}h</td>
                    <td class="data-text colored">{{amountBilled}}h</td>
                </tr>
            </table>

<!--            <div class="frequency-div">You most frequently started your workday around <strong>{{averageStartTime}}</strong>-->
<!--            </div>-->
<!--            <div class="frequency-div">You most frequently ended your workday around <strong>{{averageEndTime}}</strong>-->
<!--            </div>-->

            <table class="earned-table">
                <tr>
                    <td class="data-text">Earned</td>
                    <td class="data-text">Average Rate</td>
                    <td class="data-text">Effective Rate</td>
                </tr>
                <tr>
                    <td class="data-text colored">{{amountEarned}}$ <span style="color: #909faf; opacity: 0.6;">({{amountUp}}$)</span>
                    </td>
                    <td class="data-text colored">{{listedRate}}$</td>
                    <td class="data-text colored">{{effectiveRate}}$</td>
                </tr>
            </table>

            <div class="margin-top-20">
                <span class="company-bdown">Companies breakdown:</span>
                <table class="company-table">
                    <thead>
                    <tr class="company-theader">
                        <td>Name</td>
                        <td>Logged</td>
                        <td>Worked</td>
                        <td>Earned</td>
                    </tr>
                    </thead>
                    <tbody>
                    {{#each companyBreakdown}}
                    <tr class="comapny-breakdown">
                        <td>{{this.name}}</td>
                        <td>{{this.logged}}h</td>
                        <td>{{this.worked}}h</td>
                        <td>{{this.earned}}$</td>
                    </tr>
                    {{/each}}

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
`;
module.exports = reportTemplateHTML;
