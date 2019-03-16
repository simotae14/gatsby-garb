const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const PostTemplate = path.resolve('./src/templates/post-template.js');
const BlogTemplate = path.resolve('./src/templates/blog-template.js');

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

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const result = await graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);

    // get posts
    const posts = result.data.allMarkdownRemark.edges;
    posts.forEach(({ node: post }) => {
        createPage({
            path: `posts${ post.fields.slug }`,
            component: PostTemplate,
            context: {
                slug: post.fields.slug
            }
        });
    });

    posts.forEach((_, index, postsArr) => {
        // number pages
        const totalPages = postsArr.length;
        // post per page
        const postsPerPage = 1;
        // get the current page, start from 1
        const currentPage = index + 1;
        // check if it's the first page
        const isFirstPage = index === 0;
        // check if it's last page
        const isLastPage = currentPage === totalPages;

        createPage({
            path: isFirstPage ? '/blog' : `/blog/${currentPage}`,
            component: BlogTemplate,
            context: {
                limit: postsPerPage,
                skip: index * postsPerPage,
                isFirstPage,
                isLastPage,
                currentPage,
                totalPages
            }
        });
    });
};