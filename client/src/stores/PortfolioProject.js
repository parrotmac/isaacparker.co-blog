import {observable} from 'mobx';

class PortfolioProject {
    // TOOD: Load from server once server has this available
    @observable projects = [
        {
            slug: "health-services-platform-consortium",
            title: "HSPConsortium Website",
            coverImageURL: "https://placehold.it/300x100?text=HSPC",
            clientName: "Health Services Platform Consortium",
            writeupBody: "This one is actually deployed. Neat!"
        },
        // {
        //     slug: "matthew-turley-stock",
        //     title: "Matthew Turley Stock Photography",
        //     coverImageURL: "https://placehold.it/300x100?text=MTS",
        //     clientName: "Matthew Turley",
        //     writeupBody: "Maybe I'll finish this site"
        // },
        // {
        //     slug: "revolution-dental",
        //     title: "Revolution Dental Prosthetics Website",
        //     coverImageURL: "https://placehold.it/300x100?text=RDL",
        //     clientName: "Revolution Dental Prosthetics",
        //     writeupBody: "This one is lost to time"
        // }
    ];

}

export default PortfolioProject
