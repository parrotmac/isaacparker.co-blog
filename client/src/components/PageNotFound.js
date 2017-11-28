import React, {Component} from 'react'

class PageNotFound extends Component {
    render() {
        return (
            <div>
                <h1>
                    <pre style={{fontSize: 30, display: 'inline'}}>&gt; HTTP/1.1 404 Not Found</pre>
                </h1>
                <h3>
                    <em>
                        If you're reading this blog, then you probably know what this means.
                    </em>
                </h3>
                <p>But even so, this isn't particularly great. If you followed a link inside this website and ended up here, please let me know!</p>
            </div>
        )
    }
}

export default PageNotFound