import React, {Component} from 'react';
import Disqus from './disqus';

class ModestCommentsSection extends Component {


    render() {
        const {pageId, pageTitle, fullUrl} = this.props;

        const disqusShortname = 'isaacparker-blog';
        const disqusConfig = {
            url: fullUrl,
            identifier: pageId,
            title: pageTitle,
        };

        return (
            <div className={'col-md-10 col-md-offset-1'}>
                <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
            </div>
        )
    }
}

export default ModestCommentsSection
