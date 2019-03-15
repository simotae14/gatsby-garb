const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    // check if the added or updated node is a Markdown content
    if (node.internal.type === 'MarkdownRemark') {
        const slug = createFilePath({ node, getNode, basePath: 'posts' });
        createNodeField({
            node,
            name: 'slug',
            value: slug
        });
    }
};