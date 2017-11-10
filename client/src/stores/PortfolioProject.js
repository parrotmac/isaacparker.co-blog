import {observable} from 'mobx';

class PortfolioProject {
    // TOOD: Load from server once server has this available
    @observable projects = [
        {
            slug: "health-services-platform-consortium",
            title: "HSPConsortium Website",
            clientName: "HSPConsortium",
            writeupBody: `<p>I'm working with the HSPC (Health Services Platform Consortium) to revamp their homepage. I'll be posting more information once the rewrite is up and running.</p>`
        },
        // {
        //     slug: "matthew-turley-stock",
        //     title: "Matthew Turley Stock Photography",
        //     clientName: "Matthew Turley",
        //     writeupBody: "This project is currently in progress. Check back for updates!"
        // },
        // {
        //     slug: "revolution-dental",
        //     title: "Revolution Dental Prosthetics Website",
        //     clientName: "Revolution Dental Prosthetics",
        //     writeupBody: "This one is lost to time"
        // }
    ];

}

export default PortfolioProject
